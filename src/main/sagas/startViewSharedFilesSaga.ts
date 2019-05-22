import { v4 as uuid } from 'uuid';
import { takeEvery, call, put, select, actionChannel, flush, fork, take } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { DashboardActions } from "../../shared/actions/dashboard";
import { RpcClient } from "../RpcClient";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";
import { MainRootState } from "../reducers";
import { FileListActions } from "../../shared/actions/fileList";
import { SharedFilesActions } from "../../shared/actions/sharedFiles";
import { FileListMessage } from '../../shared/types/FileListMessage';
import { getUserNameFromFqdn } from '../../shared/system/getUserNameFromFqdn';
import { SharedFile } from '../../shared/types/SharedFile';
import { entries } from '../../shared/system/entries';
import { PublicSharedFile } from '../../shared/types/PublicSharedFile';
import { BdapActions } from '../../shared/actions/bdap';
import { LinkMessageEnvelope } from '../../shared/actions/payloadTypes/LinkMessageEnvelope';

export function* startViewSharedFilesSaga(rpcClient: RpcClient) {
    yield fork(function* () {
        yield take(getType(BdapActions.initialize))
        const pred = (action: BdapActions) => {
            switch (action.type) {
                case getType(BdapActions.linkMessageReceived):
                    return action.payload.message.type==="pshare-filelist-request";
                default:
                    return false;
            }
        }

        yield takeEvery(pred,function*(action: ActionType<typeof BdapActions.linkMessageReceived>){
            const msg=action.payload
            const {id}=msg.message
            const senderFqdn = msg.rawMessage.sender_fqdn
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
                    id
                }
                yield put(BdapActions.sendLinkMessage({ recipient: sender, payload: { id: uuid(), timestamp: Math.trunc((new Date()).getTime()), type: "pshare-filelist", payload: fileListMessage } }))
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


        yield put(DashboardActions.viewSharedFiles(linkedUserInfo))
       
    })
}




function* getSharedFileListForLink(rpcClient: RpcClient, linkedUserName: string, userName: string) {
    const msgId = uuid()
    yield put(BdapActions.sendLinkMessage({ recipient: linkedUserName, payload: { id: msgId, timestamp: Math.trunc((new Date()).getTime()), type: "pshare-filelist-request", payload: { id: msgId } } }))


    const pred = (action: BdapActions) => {
        switch (action.type) {
            case getType(BdapActions.linkMessageReceived):
                return action.payload.message.payload.id === msgId && action.payload.message.type==="pshare-filelist";
            default:
                return false;
        }
    }
    const action: ActionType<typeof BdapActions.linkMessageReceived> = yield take(pred)

    const {payload:fileListMessage}:LinkMessageEnvelope<FileListMessage>=action.payload.message
    

    return fileListMessage


}