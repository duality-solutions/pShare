import { takeEvery, call, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { DashboardActions } from "../../shared/actions/dashboard";
import { RpcClient } from "../RpcClient";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";

export function* sharedFilesSaga(rpcClient: RpcClient) {
    yield takeEvery(getType(DashboardActions.startViewSharedFiles), function* (action: ActionType<typeof DashboardActions.startViewSharedFiles>) {
        const linkedUserName = action.payload
        const userInfo: GetUserInfo = yield call(() => rpcClient.command("getuserinfo", linkedUserName))
        yield put(DashboardActions.viewSharedFiles(userInfo))
    })
}