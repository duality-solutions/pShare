import { takeEvery, select, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { MainRootState } from "../reducers";
import { LinkRequestResponse } from "../../dynamicdInterfaces/LinkRequestResponse";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { UserState } from "../../shared/reducers/user";
import { RpcClient } from "../RpcClient";
import { getMyBdapAccount } from "./helpers/getMyBdapAccount";
import { BdapAccount } from "../../dynamicdInterfaces/BdapAccount";

export function* linkRequestSaga(rpcClient: RpcClient) {

    yield takeEvery(getType(BdapActions.beginCreateLinkRequest), function* (action: ActionType<typeof BdapActions.beginCreateLinkRequest>) {
        const { requestor, recipient, inviteMessage } = action.payload
        console.log(`link request: requestor : ${requestor} , recipient : ${recipient}`)

        const { common_name: commonName }: BdapAccount = yield getMyBdapAccount(rpcClient)
        //console.log(`my common name : ${commonName}`)

        const userName: string | undefined = yield select((state: MainRootState) => state.user.userName)
        if (typeof userName === 'undefined') {
            throw Error("user.userName unexpectedly undefined")
        }
        const inviteMessage_ = inviteMessage === '' ? `${commonName} (${userName}) wants to link with you` : inviteMessage
        const requestAction = BdapActions.createLinkRequest({ ...action.payload, inviteMessage: inviteMessage_ })
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
                yield unlockedCommandEffect(rpcClient, client => client.command("link", "request", requestor, recipient, inviteMessage))
            console.log(response)

        } catch (err) {
            if (/^BDAP_SEND_LINK_RPC_ERROR\: ERRCODE\: 4001/.test(err.message)) {
                console.log("link already exists")
                yield put(BdapActions.createLinkRequestFailed("Link request or accept already exists for these accounts"))
                return
            }

            if (/^Insufficient funds/.test(err.message)) {
                yield put(BdapActions.insufficientFunds("request a link to " + recipient))
                return

            }
            throw err
        }


        yield put(BdapActions.getPendingRequestLinks())
        yield put(BdapActions.getBalance())

    })



}
