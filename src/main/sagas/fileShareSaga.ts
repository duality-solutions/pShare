import { RpcClient } from "../RpcClient";
import { select, take, actionChannel, all, put } from "redux-saga/effects";
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
import { Channel, buffers } from "redux-saga";
import { getChannelActionsUntilTimeOut } from "./helpers/getChannelActionsUntilTimeOut";
import { FileListActions } from "../../shared/actions/fileList";

type AddUnlinkAndNewLinkActionTypes =
    ActionType<typeof FileWatchActions.fileAdded>
    | ActionType<typeof FileWatchActions.fileUnlinked>
    | ActionType<typeof BdapActions.newCompleteLink>



export function* fileShareSaga(rpcClient: RpcClient) {
    const channel: Channel<AddUnlinkAndNewLinkActionTypes> =
        yield actionChannel((action: RootActions) => {
            switch (action.type) {
                case getType(FileWatchActions.fileAdded):
                case getType(FileWatchActions.fileUnlinked):
                case getType(BdapActions.newCompleteLink):

                    console.log("found AddAndUnlinkActionTypes")
                    return true
                default:
                    return false
            }
        }, buffers.expanding())
    yield all({
        initialScan: take(getType(FileWatchActions.initialScanComplete)),
        bdapFetchData: take(getType(BdapActions.bdapDataFetchSuccess))
    })
    const userName: string = yield select((s: MainRootState) => s.user.userName)



    for (; ;) {
        const allActions: AddUnlinkAndNewLinkActionTypes[] = yield getChannelActionsUntilTimeOut(channel, 5000)

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
        yield put(FileListActions.fileListPublished())
    }

}

const getRemoteLinkName = (link: Link, localUserName: string) =>
    blinq([link.recipient_fqdn, link.requestor_fqdn])
        .select(getUserNameFromFqdn)
        .single(n => n !== localUserName)

