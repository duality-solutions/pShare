import { takeEvery, call, put, take } from "redux-saga/effects";
import { getType, ActionType, isActionOf } from "typesafe-actions";
import { FileSharingActions, LinkMessageEnvelope, FileRequest, FileInfo, LinkRouteEnvelope } from "../../shared/actions/fileSharing";
import { PromiseType } from "../../shared/system/generic-types/PromiseType";
import { getOfferPeer } from "../system/webRtc/getOfferPeer";
import { v4 as uuid } from 'uuid';
import { getAnswerPeer } from "../system/webRtc/getAnswerPeer";
import { Action } from "redux";


//this runs in rtc
export function* requestFileSaga() {
    yield takeEvery(getType(FileSharingActions.requestFile), function* (action: ActionType<typeof FileSharingActions.requestFile>) {
        const peer: PromiseType<ReturnType<typeof getOfferPeer>> = yield call(() => getOfferPeer())
        const offer: RTCSessionDescription = yield call(() => peer.createOffer())
        const offerEnvelope: LinkMessageEnvelope<FileRequest> = {
            sessionDescription: offer.toJSON(),
            payload: action.payload,
            id: uuid(),
            timestamp: Math.trunc((new Date()).getTime()),
            type: "pshare-offer"
        }
        console.log("sending offerEnvelope : ", JSON.stringify(offerEnvelope))
        const routeEnvelope: LinkRouteEnvelope<LinkMessageEnvelope<FileRequest>> = {
            recipient: action.payload.ownerUserName,
            payload: offerEnvelope
        }
        yield put(FileSharingActions.sendLinkMessage(routeEnvelope))
        const answerAction: ActionType<typeof FileSharingActions.answerEnvelopeReceived> = yield take(
            (action: Action<any>) =>
                isActionOf(FileSharingActions.answerEnvelopeReceived, action)
                && action.payload.id === offerEnvelope.id,
        )
        const { payload: { sessionDescription: answerSdp } } = answerAction

        const answerSessionDescription = new RTCSessionDescription(answerSdp);
        yield call(() => peer.setRemoteDescription(answerSessionDescription))
        yield call(() => peer.waitForDataChannelOpen())
        console.log("offer side has open data channel")
    })
}

export function* processIncomingOfferSaga() {
    yield takeEvery(
        getType(FileSharingActions.offerEnvelopeReceived),
        function* (action: ActionType<typeof FileSharingActions.offerEnvelopeReceived>) {
            const { payload: offerEnvelope } = action
            const answerPeer: PromiseType<ReturnType<typeof getAnswerPeer>> = yield call(() => getAnswerPeer())
            const { sessionDescription: offerSdp, id: transactionId, payload: fileRequest } = offerEnvelope
            console.log(fileRequest)
            const offerSessionDescription = new RTCSessionDescription(offerSdp)
            const answer: RTCSessionDescription = yield call(() => answerPeer.getAnswer(offerSessionDescription))

            const answerEnvelope: LinkMessageEnvelope<FileInfo> =
            {
                sessionDescription: answer.toJSON(),
                id: transactionId,
                timestamp: Math.trunc((new Date()).getTime()),
                type: "pshare-answer",
                payload: { path: "foo", size: 1, type: "application/octet-stream" }
            }
            const routeEnvelope: LinkRouteEnvelope<LinkMessageEnvelope<FileInfo>> = {
                recipient: fileRequest.requestorUserName,
                payload: answerEnvelope
            }


            yield put(FileSharingActions.sendLinkMessage(routeEnvelope))
            yield call(() => answerPeer.waitForDataChannelOpen())
            console.log("answer side has open data channel")

        })
}


