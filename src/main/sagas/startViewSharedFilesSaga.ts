import { takeEvery, call, put, select, actionChannel, flush } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { DashboardActions } from "../../shared/actions/dashboard";
import { RpcClient } from "../RpcClient";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { MainRootState } from "../reducers";
import { FileListActions } from "../../shared/actions/fileList";
import { PublicSharedFile } from "../../shared/types/PublicSharedFile";
import { SharedFilesActions } from "../../shared/actions/sharedFiles";
import { delay } from "redux-saga";
interface BdapLinkData {
    link_requestor: string,
    link_acceptor: string,
    get_pubkey: string,
    get_operation: string,
    get_seq: number,
    data_encrypted: string,
    data_version: number,
    data_chunks: number,
    get_value: string
    get_value_size: number,
    get_milliseconds: number
}
export function* startViewSharedFilesSaga(rpcClient: RpcClient) {
    yield takeEvery(getType(DashboardActions.startViewSharedFiles), function* (action: ActionType<typeof DashboardActions.startViewSharedFiles>) {
        const linkedUserName = action.payload
        const linkedUserInfo: GetUserInfo = yield call(() => rpcClient.command("getuserinfo", linkedUserName))
        const userName: string = yield select((s: MainRootState) => s.user.userName)

        const chan = yield actionChannel(getType(SharedFilesActions.close))
        const checkClosed = function* () {
            const closeActions: any[] = yield flush(chan)
            return closeActions.some(x => true)
        }
        const linkData: BdapLinkData | undefined = yield call(() => getSharedFileListForLink(rpcClient, linkedUserName, userName))
        if (yield* checkClosed()) {
            return
        }
        if (!linkData) {
            yield put(FileListActions.fileListFetchFailed())
        }
        else {
            let data: PublicSharedFile[];
            try {
                data = JSON.parse(linkData.get_value);
                yield put(FileListActions.fileListFetchSuccess(data))
            } catch (err) {
                yield put(FileListActions.fileListFetchFailed())

            }

        }

        yield put(DashboardActions.viewSharedFiles(linkedUserInfo))
        for (; ;) {
            yield delay(10000)
            if (yield* checkClosed()) {
                break
            }
            const linkData: BdapLinkData | undefined = yield call(() => getSharedFileListForLink(rpcClient, linkedUserName, userName))
            if (yield* checkClosed()) {
                break
            }
            if (!linkData) {
                yield put(FileListActions.fileListFetchFailed())
            }
            else {
                let data: PublicSharedFile[];
                try {
                    data = JSON.parse(linkData.get_value);
                } catch (err) {
                    yield put(FileListActions.fileListFetchFailed())
                    continue
                }
                yield put(FileListActions.fileListFetchSuccess(data))
            }


        }
    })
}

function* getSharedFileListForLink(rpcClient: RpcClient, linkedUserName: string, userName: string) {
    let linkData: BdapLinkData | undefined
    try {
        linkData = yield unlockedCommandEffect(rpcClient, client => client.command("dht", "getlinkrecord", linkedUserName, userName, "pshare-filelist"))
    } catch (err) {
        if (!/getbdaplinkdata: ERRCODE: 5626 - Failed to get record:/.test(err.message)) {
            throw err
        }
    }
    return linkData
}