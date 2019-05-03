import { takeEvery, call, put, take, race } from "redux-saga/effects";
import { getType, ActionType, isActionOf } from "typesafe-actions";
import { FileSharingActions } from "../../shared/actions/fileSharing";
import { LinkRouteEnvelope } from "../../shared/actions/payloadTypes/LinkRouteEnvelope";
import { LinkMessageEnvelope } from "../../shared/actions/payloadTypes/LinkMessageEnvelope";
import { FileRequest } from "../../shared/actions/payloadTypes/FileRequest";
import { PromiseType } from "../../shared/system/generic-types/PromiseType";
import { getOfferPeer } from "../system/webRtc/getOfferPeer";
import { v4 as uuid } from 'uuid';
import { Action } from "redux";
import * as path from 'path'
import { RtcActions } from "../../shared/actions/rtc";
import { receiveFileFromRTCPeer } from "./helpers/receiveFileFromRTCPeer";
import { prepareErrorForSerialization } from "../../shared/proxy/prepareErrorForSerialization";
import { UserSharePaths, getOrCreateShareDirectoriesForUser } from "./helpers/getOrCreateShareDirectoriesForUser";
import { safeRename } from "./helpers/safeRename";
import { delay } from "redux-saga";


//this runs in rtc
export function* requestFileSaga() {
    yield takeEvery(getType(FileSharingActions.requestFile), function* (action: ActionType<typeof FileSharingActions.requestFile>) {
        const peer: PromiseType<ReturnType<typeof getOfferPeer>> = yield call(() => getOfferPeer())
        try {
            const offer: RTCSessionDescription = yield call(() => peer.createOffer())
            const fileRequest: FileRequest = action.payload;
            const offerEnvelope: LinkMessageEnvelope<FileRequest> = {
                sessionDescription: offer.toJSON(),
                payload: fileRequest,
                id: uuid(),
                timestamp: Math.trunc((new Date()).getTime()),
                type: "pshare-offer"
            }
            const routeEnvelope: LinkRouteEnvelope<LinkMessageEnvelope<FileRequest>> = {
                recipient: action.payload.ownerUserName,
                payload: offerEnvelope
            }
            yield put(FileSharingActions.sendLinkMessage(routeEnvelope))

            const { answerAction }: { answerAction: ActionType<typeof FileSharingActions.answerEnvelopeReceived> } = yield race({
                timeout: delay(90 * 1000),
                answerAction: take(
                    (action: Action<any>) =>
                        isActionOf(FileSharingActions.answerEnvelopeReceived, action)
                        && action.payload.id === offerEnvelope.id,
                )
            })

            if (!answerAction) {
                yield put(RtcActions.fileReceiveFailed({ fileRequest, error: Error("timeout") }))
                return
            }

            const { payload: { sessionDescription: answerSdp, payload: fileInfo } } = answerAction

            const answerSessionDescription = new RTCSessionDescription(answerSdp);
            yield call(() => peer.setRemoteDescription(answerSessionDescription))
            yield call(() => peer.waitForDataChannelOpen())


            const otherEndUser = action.payload.ownerUserName
            const { incoming, temp }: UserSharePaths = yield getOrCreateShareDirectoriesForUser(otherEndUser);
            const tempPath = path.join(temp, `__${uuid()}`)

            //debugger
            try {
                yield receiveFileFromRTCPeer(tempPath, peer, fileInfo, fileRequest)
            } catch (err) {
                yield put(RtcActions.fileReceiveFailed({ fileRequest, error: prepareErrorForSerialization(err) }))
                return
            }


            const safeName = path.basename(path.normalize(fileRequest.fileName))
            yield safeRename(tempPath, incoming, safeName)
            yield put(RtcActions.fileReceiveSuccess(fileRequest))

        }
        finally {
            peer.close()
        }
    })
}
