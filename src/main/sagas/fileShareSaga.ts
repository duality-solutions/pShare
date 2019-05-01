import { RpcClient } from "../RpcClient";
import { select, all, take } from "redux-saga/effects";
import { MainRootState } from "../reducers";
import { InOutSharedFiles } from "../../shared/reducers/fileWatch";
import { Link } from "../../dynamicdInterfaces/links/Link";
import { blinq } from "blinq";
import { getUserNameFromFqdn } from "../../shared/system/getUserNameFromFqdn";
import { entries } from "../../shared/system/entries";
import { SharedFile } from "../../shared/types/SharedFile";
import { BdapActions } from "../../shared/actions/bdap";
import { getType } from "typesafe-actions";
import { FileWatchActions } from "../../shared/actions/fileWatch";


interface PublicSharedFile {
    fileName: string
    hash: string
    size: number
    contentType: string
}
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
    const entriesWithMatchingCompleteLink =
        entries(fileShareUsers)
            .join<[string, InOutSharedFiles], string, string, [string, Record<string, SharedFile>]>(
                remoteUsers,
                ([un]) => un,
                n => n,
                ([un, e]) => [un, e.out])



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

    }

}