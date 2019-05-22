import { v4 as uuid } from 'uuid';
import { takeEvery, call, put, select, actionChannel, flush, fork, take, cancel } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { DashboardActions } from "../../shared/actions/dashboard";
import { RpcClient } from "../RpcClient";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { MainRootState } from "../reducers";
import { FileListActions } from "../../shared/actions/fileList";
//import { PublicSharedFile } from "../../shared/types/PublicSharedFile";
import { SharedFilesActions } from "../../shared/actions/sharedFiles";
//import { delay } from "redux-saga";
import { scanForLinkMessages } from "./helpers/scanForLinkMessages";
import { LinkMessage } from "../../dynamicdInterfaces/LinkMessage";
import { FileListMessage } from '../../shared/types/FileListMessage';
import { Action } from 'redux';
import { getUserNameFromFqdn } from '../../shared/system/getUserNameFromFqdn';
import { SharedFile } from '../../shared/types/SharedFile';
import { entries } from '../../shared/system/entries';
import { PublicSharedFile } from '../../shared/types/PublicSharedFile';
import { BdapActions } from '../../shared/actions/bdap';
// interface BdapLinkData {
//     link_requestor: string,
//     link_acceptor: string,
//     get_pubkey: string,
//     get_operation: string,
//     get_seq: number,
//     data_encrypted: string,
//     data_version: number,
//     data_chunks: number,
//     get_value: string
//     get_value_size: number,
//     get_milliseconds: number
// }
export function* startViewSharedFilesSaga(rpcClient: RpcClient) {
    yield fork(function* () {
        yield take(getType(BdapActions.initialize))
        yield* scanForLinkMessages(rpcClient, "pshare-filelist-request", 3000, function* (msg: LinkMessage) {
            const requestMessage: { id: string } = JSON.parse(msg.message)
            const senderFqdn = msg.sender_fqdn
            const sender = getUserNameFromFqdn(senderFqdn)
            if (sender) {
                const filesRecord: Record<string, SharedFile> = yield select((s: MainRootState) => {
                    if (s.fileWatch.users[sender]) {
                        return s.fileWatch.users[sender].out;
                    }
                    else {
                        return {}
                    }
                })
                const sharedFiles: PublicSharedFile[] =
                    entries(filesRecord)
                        .select(([fileName, v]) => ({
                            fileName,
                            hash: v.hash!,
                            size: v.size!,
                            contentType: v.contentType!
                        }))
                        .toArray()

                const fileListMessage: FileListMessage = {
                    files: sharedFiles,
                    id: requestMessage.id
                }
                const fileListMessageJson = JSON.stringify(fileListMessage)
                const userName: string = yield select((s: MainRootState) => s.user.userName)
                yield unlockedCommandEffect(rpcClient, client => client.command("link", "sendmessage", userName, sender, "pshare-filelist", fileListMessageJson))
            }
        })
    })
    yield takeEvery(getType(DashboardActions.startViewSharedFiles), function* (action: ActionType<typeof DashboardActions.startViewSharedFiles>) {
        const linkedUserName = action.payload
        const linkedUserInfo: GetUserInfo = yield call(() => rpcClient.command("getuserinfo", linkedUserName))
        const userName: string = yield select((s: MainRootState) => s.user.userName)

        const chan = yield actionChannel(getType(SharedFilesActions.close))
        const checkClosed = function* () {
            const closeActions: any[] = yield flush(chan)
            return closeActions.some(x => true)
        }
        const fileListMessage: FileListMessage = yield call(() => getSharedFileListForLink(rpcClient, linkedUserName, userName))
        if (yield* checkClosed()) {
            return
        }
        const fileList = fileListMessage.files
        yield put(FileListActions.fileListFetchSuccess(fileList))
        // if (!linkData) {
        //     yield put(FileListActions.fileListFetchFailed())
        // }
        // else {
        //     let data: PublicSharedFile[];
        //     try {
        //         data = JSON.parse(linkData.get_value);
        //         yield put(FileListActions.fileListFetchSuccess(data))
        //     } catch (err) {
        //         yield put(FileListActions.fileListFetchFailed())

        //     }

        // }

        yield put(DashboardActions.viewSharedFiles(linkedUserInfo))
        // for (; ;) {
        //     yield delay(10000)
        //     if (yield* checkClosed()) {
        //         break
        //     }
        //     const linkData: BdapLinkData | undefined = yield call(() => getSharedFileListForLink(rpcClient, linkedUserName, userName))
        //     if (yield* checkClosed()) {
        //         break
        //     }
        //     if (!linkData) {
        //         yield put(FileListActions.fileListFetchFailed())
        //     }
        //     else {
        //         let data: PublicSharedFile[];
        //         try {
        //             data = JSON.parse(linkData.get_value);
        //         } catch (err) {
        //             yield put(FileListActions.fileListFetchFailed())
        //             continue
        //         }
        //         yield put(FileListActions.fileListFetchSuccess(data))
        //     }


        // }
    })
}

// pshare-filelist
// pshare-filelist-request



function* getSharedFileListForLink(rpcClient: RpcClient, linkedUserName: string, userName: string) {
    const msgId = uuid()
    const requestMessage = JSON.stringify({ id: msgId })
    yield unlockedCommandEffect(rpcClient, client => client.command("link", "sendmessage", userName, linkedUserName, "pshare-filelist-request", requestMessage))
    const task = yield fork(function* () {
        yield* scanForLinkMessages(rpcClient, "pshare-filelist", 1000, function* (msg: LinkMessage) {
            const fileListMsg: FileListMessage = JSON.parse(msg.message)
            yield put(FileListActions.fileListMessageFetchSuccess(fileListMsg))
        })
    })

    const pred: (action: Action<any>) => boolean =
        (action: FileListActions) => {
            switch (action.type) {
                case getType(FileListActions.fileListMessageFetchSuccess):
                    return action.payload.id === msgId;
                default:
                    return false;
            }
        }
    const { payload: fileListMessage }: ActionType<typeof FileListActions.fileListMessageFetchSuccess> = yield take(pred)
    yield cancel(task)

    return fileListMessage

    //yield take()

    // let linkData: BdapLinkData | undefined
    // try {
    //     linkData = yield unlockedCommandEffect(rpcClient, client => client.command("dht", "getlinkrecord", linkedUserName, userName, "pshare-filelist"))
    // } catch (err) {
    //     if (!/Failed to get record/.test(err.message)) {
    //         throw err
    //     }
    // }
    // return linkData
}