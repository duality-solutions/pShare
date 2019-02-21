import { takeEvery, put, call, select } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { getRpcClient } from "../getRpcClient";
import { RpcClient } from "../RpcClient";
import { LinkResponse } from "../../dynamicdInterfaces/links/LinkResponse";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { MainRootState } from "../reducers";
import { RpcCommandFunc } from "../RpcCommandFunc";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";
import { Link } from "../../dynamicdInterfaces/links/Link";
import { entries } from "../../shared/system/entries";

export function* bdapSaga() {
    yield takeEvery(getType(BdapActions.getUsers), function* () {
        const rpcClient: RpcClient = yield call(() => getRpcClient())
        let response: GetUserInfo[];
        try {
            response = yield call(() => rpcClient.command("getusers"))

        } catch (err) {
            yield put(BdapActions.getUsersFailed(err.message))
            return
        }
        yield put(BdapActions.getUsersSuccess(response))
    })
    yield takeEvery(getType(BdapActions.getPendingAcceptLinks), function* () {
        yield* rpcLinkCommand((command) => command("link", "pending", "accept"), BdapActions.getPendingAcceptLinksSuccess, BdapActions.getPendingAcceptLinksFailed)
    })
    yield takeEvery(getType(BdapActions.getPendingRequestLinks), function* () {
        yield* rpcLinkCommand((command) => command("link", "pending", "request"), BdapActions.getPendingRequestLinksSuccess, BdapActions.getPendingRequestLinksFailed)
    })
    yield takeEvery(getType(BdapActions.getCompleteLinks), function* () {
        const rpcClient: RpcClient = yield call(() => getRpcClient())
        let response: LinkResponse<Link>;
        try {
            response = yield call(() => rpcClient.command("link", "complete"))

        } catch (err) {
            yield put(BdapActions.getCompleteLinksFailed(err.message))
            return
        }
        yield put(BdapActions.getCompleteLinksSuccess(extractLinks(response)))

    })

    yield takeEvery(getType(BdapActions.initialize), function* () {
        yield put(BdapActions.getUsers())
        yield put(BdapActions.getCompleteLinks())
        yield put(BdapActions.getPendingAcceptLinks())
        yield put(BdapActions.getPendingRequestLinks())
    })
}


const extractLinks = <T extends Link>(response: LinkResponse<T>): T[] => entries(response).select(([, v]) => v).toArray()


function* rpcLinkCommand<T extends Link>(
    cmd: (c: RpcCommandFunc) => Promise<LinkResponse<T>>,
    successActionCreator: (entries: T[]) => any,
    failActionCreator: (message: string) => any
) {
    const password: string | undefined = yield select((state: MainRootState) => state.user.sessionWalletPassword)
    if (typeof password === 'undefined') {
        yield put(failActionCreator("no password in state"))
        return
    }
    let response: LinkResponse<T>;
    try {
        response = yield unlockedCommandEffect(password, cmd)
    } catch (err) {
        yield put(failActionCreator(err.message))
        return;
    }
    const links = extractLinks(response)
    yield put(successActionCreator(links))
}