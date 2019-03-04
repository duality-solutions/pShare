import { takeEvery, select, call } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { BdapActions } from "../../shared/actions/bdap";
import { MainRootState } from "../reducers";
import { LinkRequestResponse } from "../../dynamicdInterfaces/LinkRequestResponse";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";
import { UserState } from "../../shared/reducers/user";
import { getRpcClient } from "../getRpcClient";
import { RpcClient } from "../RpcClient";
import { entries } from "../../shared/system/entries";

export function* linkRequestSaga() {

    yield takeEvery(getType(BdapActions.beginCreateLinkRequest), function* (action: ActionType<typeof BdapActions.beginCreateLinkRequest>) {
        const { requestor, recipient } = action.payload
        console.log(`link request: requestor : ${requestor} , recipient : ${recipient}`)

        const { common_name: commonName }: BdapAccount = yield getMyBdapAccount()
        console.log(`my common name : ${commonName}`)


        const inviteMessage = `${commonName} wants to link with you`
        const requestAction = BdapActions.createLinkRequest({ ...action.payload, inviteMessage })
        console.log(requestAction)
        // yield put(BdapActions.createLinkRequest({ ...action.payload, inviteMessage }))
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

        // @ts-ignore
        const response: LinkRequestResponse =
            yield unlockedCommandEffect(command => command("link", "request", requestor, recipient, inviteMessage))


    })



}

interface BdapAccount {
    _id: string,
    version: number,
    domain_component: string,
    common_name: string,
    organizational_unit: string,
    organization_name: string,
    object_id: string,
    object_full_path: string,
    object_type: string,
    wallet_address: string,
    public: number,
    dht_publickey: string,
    link_address: string,
    txid: string,
    time: number,
    expires_on: number,
    expired: boolean
}

const getMyBdapAccount = () => call(function* () {
    const rpcClient: RpcClient = yield call(async () => getRpcClient())
    const myBdapAccountsResponse: Record<string, BdapAccount> = yield call(() => rpcClient.command("mybdapaccounts"))
    debugger
    const myBdapAccounts = entries(myBdapAccountsResponse).select(([, v]) => v)
    const user: UserState = yield select((state: MainRootState) => state.user)
    const myBdapAccount = myBdapAccounts.singleOrDefault(acc => acc.object_id === user.userName)
    return myBdapAccount
})
