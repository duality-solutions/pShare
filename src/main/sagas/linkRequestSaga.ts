import { takeEvery, select, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { MainRootState } from "../reducers";
import { LinkRequestResponse } from "../../dynamicdInterfaces/LinkRequestResponse";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { UserState } from "../../shared/reducers/user";
import { RpcClient } from "../RpcClient";
import { getMyBdapAccount } from "./effects/getMyBdapAccount";
import { BdapAccount } from "../../dynamicdInterfaces/BdapAccount";

export function* linkRequestSaga(rpcClient: RpcClient) {

    yield takeEvery(getType(BdapActions.beginCreateLinkRequest), function* (action: ActionType<typeof BdapActions.beginCreateLinkRequest>) {
        const { requestor, recipient } = action.payload
        console.log(`link request: requestor : ${requestor} , recipient : ${recipient}`)

        const { common_name: commonName }: BdapAccount = yield getMyBdapAccount(rpcClient)
        //console.log(`my common name : ${commonName}`)

        const userName: string | undefined = yield select((state: MainRootState) => state.user.userName)
        if (typeof userName === 'undefined') {
            throw Error("user.userName unexpectedly undefined")
        }
        const inviteMessage = `${commonName} (${userName}) wants to link with you`
        const requestAction = BdapActions.createLinkRequest({ ...action.payload, inviteMessage })
        console.log(requestAction)
        yield put(requestAction)
    })



    yield takeEvery(getType(BdapActions.createLinkRequest), function* (action: ActionType<typeof BdapActions.createLinkRequest>) {
        const { payload: { recipient, requestor, inviteMessage } } = action
        const user: UserState = yield select((state: MainRootState) => state.user)
        const { userName } = user
        if (typeof userName === 'undefined') {
            throw Error("current user has no userName")
        }
        if (requestor !== userName) {
            throw Error(`cannot issue link requests for any user other than ${userName}`)
        }


        let response: LinkRequestResponse;

        try {
            response =
                yield unlockedCommandEffect(rpcClient, command => command("link", "request", requestor, recipient, inviteMessage))

        } catch (err) {
            if (/^BDAP_SEND_LINK_RPC_ERROR\: ERRCODE\: 4001/.test(err.message)) {
                console.log("link already exists")
                yield put(BdapActions.createLinkRequestFailed("Link request or accept already exists for these accounts"))
                return
            }
            debugger
            throw err
        }

        console.log(response)
        yield put(BdapActions.getPendingRequestLinks())

    })



}



