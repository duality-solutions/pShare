import { takeEvery, select, call } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { MainRootState } from "../reducers";
import { getRpcClient } from "../getRpcClient";
import { RpcClient } from "../RpcClient";
import { LinkAcceptResponse } from "../../dynamicdInterfaces/LinkAcceptResponse";
import { LinkRequestResponse } from "../../dynamicdInterfaces/LinkRequestResponse";

export function* linkRequestSaga() {
    yield takeEvery(getType(BdapActions.createLinkRequest), function* (action: ActionType<typeof BdapActions.createLinkRequest>) {
        const { payload: { recipient, requestor, inviteMessage } } = action
        const userName: string = yield select((state: MainRootState) => state.user.userName)
        if (typeof userName === 'undefined') {
            throw Error("current user has no userName")
        }
        if (requestor !== userName) {
            throw Error(`cannot issue link requests for any user other than ${userName}`)
        }
        const rpcClient: RpcClient = yield call(() => getRpcClient())

        // @ts-ignore
        const response: LinkRequestResponse = yield call(() => rpcClient.command("link", "request", requestor, recipient, inviteMessage))
    })
}

export function* linkAcceptSaga() {
    yield takeEvery(getType(BdapActions.acceptLink), function* (action: ActionType<typeof BdapActions.acceptLink>) {
        const { payload: { recipient, requestor, registrationDays } } = action
        const userName: string = yield select((state: MainRootState) => state.user.userName)
        if (typeof userName === 'undefined') {
            throw Error("current user has no userName")
        }
        if (recipient !== userName) {
            throw Error(`recipient marked as ${recipient} but I am ${userName}`)
        }
        const rpcClient: RpcClient = yield call(() => getRpcClient())

        // @ts-ignore
        const response: LinkAcceptResponse = yield call(() =>
            typeof registrationDays === 'undefined'
                ? rpcClient.command("link", "request", requestor, recipient)
                : rpcClient.command("link", "request", requestor, recipient, registrationDays))
    })
}