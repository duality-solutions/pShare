import { put, take, fork } from "redux-saga/effects";
import { FileSharingActions } from "../../shared/actions/fileSharing";
import { LinkMessageEnvelope } from "../../shared/actions/payloadTypes/LinkMessageEnvelope";
import { FileInfo } from "../../shared/actions/payloadTypes/FileInfo";
import { FileRequest } from "../../shared/actions/payloadTypes/FileRequest";
import { RpcClient } from "../RpcClient";
import { delay } from "redux-saga";
import { BdapActions } from "../../shared/actions/bdap";
import { getType } from "typesafe-actions";
import { LinkMessage } from "../../dynamicdInterfaces/LinkMessage";
import { scanForLinkMessages } from "./helpers/scanForLinkMessages";
import { SessionDescriptionEnvelope } from "../../shared/actions/payloadTypes/SessionDescriptionEnvelope";
//runs in main
export function* scanForLinkMessagesSaga(rpcClient: RpcClient) {
    yield take(getType(BdapActions.initialize))

    console.log("scanForOfferSaga starting")

    yield fork(() => scanForLinkMessages(rpcClient, "pshare-offer", 10000, function* (lm: LinkMessage) {
        const offerEnvelope: LinkMessageEnvelope<SessionDescriptionEnvelope<FileRequest>> = JSON.parse(lm.message);
        yield put(FileSharingActions.offerEnvelopeReceived(offerEnvelope));
    }))
    // this delay is to stagger the timings of the two (repeating) scanForLinkMessages tasks
    yield delay(5000)
    yield fork(() => scanForLinkMessages(rpcClient, "pshare-answer", 10000, function* (lm: LinkMessage) {
        const answerEnvelope: LinkMessageEnvelope<SessionDescriptionEnvelope<FileInfo>> = JSON.parse(lm.message);
        yield put(FileSharingActions.answerEnvelopeReceived(answerEnvelope));
    }))


}


