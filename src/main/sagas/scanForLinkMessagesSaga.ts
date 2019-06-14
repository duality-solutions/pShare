import { put, take, fork } from "redux-saga/effects";
import { LinkMessageEnvelope } from "../../shared/actions/payloadTypes/LinkMessageEnvelope";
import { RpcClient } from "../RpcClient";
import { BdapActions } from "../../shared/actions/bdap";
import { getType } from "typesafe-actions";
import { LinkMessage } from "../../dynamicdInterfaces/LinkMessage";
import { pollLinkMessages } from "./helpers/pollLinkMessages";
//runs in main
export function* scanForLinkMessagesSaga(rpcClient: RpcClient) {
    yield take(getType(BdapActions.initialize))

    console.log("scanForOfferSaga starting")

    yield fork(() => pollLinkMessages(rpcClient, "pshare-msg", 2000, function* (lm: LinkMessage) {
        const message: LinkMessageEnvelope<any> = JSON.parse(lm.message)
        
        yield put(BdapActions.linkMessageReceived({message,rawMessage:lm}))
    }))




}


