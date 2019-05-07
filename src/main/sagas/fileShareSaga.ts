import { RpcClient } from "../RpcClient";
import { select, all, take, actionChannel, flush } from "redux-saga/effects";
import { MainRootState } from "../reducers";
import { InOutSharedFiles } from "../../shared/reducers/fileWatch";
import { Link, isLink } from "../../dynamicdInterfaces/links/Link";
import { blinq } from "blinq";
import { getUserNameFromFqdn } from "../../shared/system/getUserNameFromFqdn";
import { entries } from "../../shared/system/entries";
import { SharedFile } from "../../shared/types/SharedFile";
import { BdapActions } from "../../shared/actions/bdap";
import { getType, ActionType } from "typesafe-actions";
import { FileWatchActions } from "../../shared/actions/fileWatch";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { PublicSharedFile } from "../../shared/types/PublicSharedFile";
import { RootActions } from "../../shared/actions";
import { Channel, delay } from "redux-saga";


export function* fileShareSaga(rpcClient: RpcClient) {
    yield all({
        bdapDataFetch: take(getType(BdapActions.bdapDataFetchSuccess)),
        initialScanComplete: take(getType(FileWatchActions.initialScanComplete))
    })
    const fileShareUsers: Record<string, InOutSharedFiles> = yield select((s: MainRootState) => s.fileWatch.users)
    const completeLinks: Link[] = yield select((s: MainRootState) => s.bdap.completeLinks)
    const userName: string = yield select((s: MainRootState) => s.user.userName)
    const remoteUsers =
        blinq(completeLinks)
            .selectMany(l => [l.recipient_fqdn, l.requestor_fqdn])
            .select(fqdn => getUserNameFromFqdn(fqdn)!)
            .where(n => n !== userName);

    // remoteUsers.leftOuterJoin<string,[string, InOutSharedFiles],string,[string, Record<string, SharedFile>]>(
    //     entries(fileShareUsers),
    //     x=>x,
    //     ([x])=>x,
    //     (x1,[un, e])=>[un, e.out]
    // )
    const entriesWithMatchingCompleteLink =
        remoteUsers
            .leftOuterJoin<string, [string, InOutSharedFiles], string, [string, Record<string, SharedFile>]>(
                entries(fileShareUsers),
                remoteUserName => remoteUserName,
                ([fileShareUserName]) => fileShareUserName,
                (remUn, x) => [remUn, x ? x[1].out : {}])
            .where(([, sharedFiles]) => typeof sharedFiles !== 'undefined')

    //console.log(`ENTRIES : ${JSON.stringify([...entriesWithMatchingCompleteLink])}`)

    const dataForLinks =
        entriesWithMatchingCompleteLink
            .select<[string, Record<string, SharedFile>], [string, Iterable<PublicSharedFile>]>(
                ([userName, sharedFiles]) => [
                    userName,
                    entries(sharedFiles)
                        .select(([fileName, sharedFile]) => ({
                            fileName,
                            hash: sharedFile.hash!,
                            size: sharedFile.size!,
                            contentType: sharedFile.contentType!
                        }))
                        .orderBy(x => x.hash)
                ])

    for (const [remoteUserName, publicSharedFiles] of dataForLinks) {
        const serialized = JSON.stringify([...publicSharedFiles])
        console.log(`shared with ${remoteUserName} : ${serialized}`)
        // dht putlinkrecord hfchrissperry100 hfchrissperry101 pshare-filelist "<JSON>"
        const result =
            yield unlockedCommandEffect(
                rpcClient,
                client =>
                    client.command("putbdaplinkdata", userName, remoteUserName, "pshare-filelist", serialized))
        console.log(`putbdaplinkdata returned ${JSON.stringify(result, null, 2)}`)
    }

    type AddAndUnlinkActionTypes =
        ActionType<typeof FileWatchActions.fileAdded>
        | ActionType<typeof FileWatchActions.fileUnlinked>
        | ActionType<typeof BdapActions.newCompleteLink>

    const channel: Channel<AddAndUnlinkActionTypes> =
        yield actionChannel((action: RootActions) => {
            switch (action.type) {
                case getType(FileWatchActions.fileAdded):
                case getType(FileWatchActions.fileUnlinked):
                case getType(BdapActions.newCompleteLink):
                    return true
                default:
                    return false
            }
        })

    for (; ;) {
        const allActions: AddAndUnlinkActionTypes[] = []

        const action: AddAndUnlinkActionTypes =
            yield take(channel)
        allActions.push(action)
        for (; ;) {
            yield delay(5000)
            const actions: AddAndUnlinkActionTypes[] = yield flush(channel)
            if (!actions.some(x => true)) {
                break
            }
            allActions.concat(actions)
        }

        const usersThatNeedUpdating = blinq(allActions)
            .select(a =>
                isLink(a.payload)
                    ? getRemoteLinkName(a.payload, userName)
                    : a.payload.sharedWith)
            .selectMany(x => x == null ? [] : [x])
            .distinct()


        const existingFileWatchUsers: Record<string, InOutSharedFiles> = yield select((s: MainRootState) => s.fileWatch.users)
        const completeLinks: Link[] = yield select((s: MainRootState) => s.bdap.completeLinks)
        const remoteUsers =
            blinq(completeLinks)
                .selectMany(l => [l.recipient_fqdn, l.requestor_fqdn])
                .select(fqdn => getUserNameFromFqdn(fqdn)!)
                .intersect(usersThatNeedUpdating)
        const entriesWithMatchingCompleteLink =
            remoteUsers
                .leftOuterJoin<string, [string, InOutSharedFiles], string, [string, Record<string, SharedFile> | undefined]>(
                    entries(existingFileWatchUsers),
                    remoteUserName => remoteUserName,
                    ([fileShareUserName]) => fileShareUserName,
                    (remUn, x) => [remUn, x ? x[1].out || {} : {}])
                .where(([, sharedFiles]) => typeof sharedFiles !== 'undefined')
        const dataForLinks =
            entriesWithMatchingCompleteLink
                .select<[string, Record<string, SharedFile> | undefined], [string, Iterable<PublicSharedFile>]>(
                    ([userName, sharedFiles]) => [
                        userName,
                        sharedFiles
                            ? entries(sharedFiles)
                                .select(([fileName, sharedFile]) => ({
                                    fileName,
                                    hash: sharedFile.hash!,
                                    size: sharedFile.size!,
                                    contentType: sharedFile.contentType!
                                }))
                                .orderBy(x => x.hash)
                            : []
                    ])
        for (const [remoteUserName, publicSharedFiles] of dataForLinks) {
            const serialized = JSON.stringify([...publicSharedFiles])
            console.log(`shared with ${remoteUserName} : ${serialized}`)
            //dht putlinkrecord hfchrissperry100 hfchrissperry101 pshare-filelist "<JSON>"
            const result =
                yield unlockedCommandEffect(
                    rpcClient,
                    client =>
                        client.command("putbdaplinkdata", userName, remoteUserName, "pshare-filelist", serialized))
            console.log(`putbdaplinkdata returned ${JSON.stringify(result, null, 2)}`)
        }
    }

}

const getRemoteLinkName = (link: Link, localUserName: string) =>
    blinq([link.recipient_fqdn, link.requestor_fqdn])
        .select(getUserNameFromFqdn)
        .single(n => n !== localUserName)