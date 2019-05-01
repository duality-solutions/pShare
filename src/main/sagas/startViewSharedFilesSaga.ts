import { takeEvery, call, put, select } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { DashboardActions } from "../../shared/actions/dashboard";
import { RpcClient } from "../RpcClient";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { MainRootState } from "../reducers";
import { FileListActions } from "../../shared/actions/fileList";
import { PublicSharedFile } from "../../shared/types/PublicSharedFile";
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
        const userInfo: GetUserInfo = yield call(() => rpcClient.command("getuserinfo", linkedUserName))
        const userName: string = yield select((s: MainRootState) => s.user.userName)
        let linkData: BdapLinkData | undefined
        try {
            linkData = yield unlockedCommandEffect(rpcClient, command => command("getbdaplinkdata", userInfo.object_id, userName, "pshare-filelist"))
        } catch (err) {
            if (!/getbdaplinkdata: ERRCODE: 5626 - Failed to get record:/.test(err.message)) {
                throw err
            }
        }
        if (!linkData) {
            yield put(FileListActions.fileListFetchFailed())
        }
        else {
            const data:PublicSharedFile[] = JSON.parse(linkData.get_value);
            yield put(FileListActions.fileListFetchSuccess(data))
        }
        yield put(DashboardActions.viewSharedFiles(userInfo))
    })
}