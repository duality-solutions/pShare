import { takeEvery, put, call, select } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { getRpcClient } from "../getRpcClient";
import { RpcClient } from "../RpcClient";
import { GetUsersEntry } from "../../dynamicdInterfaces/getusers/GetUsersEntry";
import { LinkRequestEntry } from "../../dynamicdInterfaces/links/LinkRequestEntry";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { MainRootState } from "../reducers";
import { RpcCommandFunc } from "../RpcCommandFunc";

export function* bdapSaga() {
    yield takeEvery(getType(BdapActions.getUsers), function* () {
        const rpcClient: RpcClient = yield call(() => getRpcClient())
        let response: GetUsersEntry[];
        response = yield call(() => rpcClient.command("getusers"))
        yield put(BdapActions.getUsersSuccess(response))
    })
    yield takeEvery(getType(BdapActions.getPendingLinks), function* () {
        yield* rpcLinkCommand((command) => command("link", "pending"), BdapActions.getPendingLinksSuccess, BdapActions.getPendingLinksFailed)
    })
    yield takeEvery(getType(BdapActions.getCompleteLinks), function* () {
        yield* rpcLinkCommand((command) => command("link", "complete"), BdapActions.getCompleteLinksSuccess, BdapActions.getCompleteLinksFailed)
    })
}





function* rpcLinkCommand(
    cmd: (c: RpcCommandFunc) => Promise<LinkRequestEntry[]>,
    successActionCreator: (entries: LinkRequestEntry[]) => any,
    failActionCreator: (message: string) => any
) {
    const password: string | undefined = yield select((state: MainRootState) => state.user.sessionWalletPassword)
    if (typeof password === 'undefined') {
        yield put(failActionCreator("no password in state"))
        return
    }
    let response: LinkRequestEntry[];
    try {
        response = yield unlockedCommandEffect(password, cmd)
    } catch (err) {
        yield put(failActionCreator(err.message))
        return;
    }
    yield put(successActionCreator(response))
}