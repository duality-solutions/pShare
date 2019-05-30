import { takeEvery, call, put, take, race, select } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { FileSharingActions } from "../../shared/actions/fileSharing";
import { LinkRouteEnvelope } from "../../shared/actions/payloadTypes/LinkRouteEnvelope";
import { LinkMessageEnvelope } from "../../shared/actions/payloadTypes/LinkMessageEnvelope";
import { FileRequest } from "../../shared/actions/payloadTypes/FileRequest";
import { PromiseType } from "../../shared/system/generic-types/PromiseType";
import { getOfferPeer } from "../system/webRtc/getOfferPeer";
import { v4 as uuid } from 'uuid';
import * as path from 'path'
import { RtcActions } from "../../shared/actions/rtc";
import { receiveFileFromRTCPeer } from "./helpers/receiveFileFromRTCPeer";
import { prepareErrorForSerialization } from "../../shared/proxy/prepareErrorForSerialization";
import { UserSharePaths, getOrCreateShareDirectoriesForUser } from "./helpers/getOrCreateShareDirectoriesForUser";
import { delay } from "redux-saga";
import * as fs from 'fs'
import { FileRequestWithSavePath } from "../../shared/actions/payloadTypes/FileRequestWithSavePath";
import { RtcRootState } from "../reducers";
import { BdapActions } from "../../shared/actions/bdap";
import { SessionDescriptionEnvelope } from "../../shared/actions/payloadTypes/SessionDescriptionEnvelope";
import { FileInfo } from "../../shared/actions/payloadTypes/FileInfo";


//this runs in rtc
export function* requestFileSaga() {
    yield takeEvery(getType(FileSharingActions.requestFileWithSavePath), function* (action: ActionType<typeof FileSharingActions.requestFileWithSavePath>) {
        const rtcConfig: RTCConfiguration = yield select((s: RtcRootState) => s.rtcConfig)

        const peer: PromiseType<ReturnType<typeof getOfferPeer>> = yield call(() => getOfferPeer(rtcConfig))
        try {
            const fileRequest: FileRequestWithSavePath = action.payload;
            yield put(RtcActions.fileReceiveProgress({ fileRequest, downloadedBytes: 0, totalBytes: 0, downloadedPct: 0, status: "negotiating connection" }))
            const offer: RTCSessionDescription = yield call(() => peer.createOffer())
            yield put(RtcActions.fileReceiveProgress({ fileRequest, downloadedBytes: 0, totalBytes: 0, downloadedPct: 0, status: "sending offer" }))
            const offerEnvelope: LinkMessageEnvelope<SessionDescriptionEnvelope<FileRequest>> = {

                payload: { payload: fileRequest, sessionDescription: offer.toJSON() },
                id: uuid(),
                timestamp: Math.trunc((new Date()).getTime()),
                type: "pshare-offer"
            }
            const routeEnvelope: LinkRouteEnvelope<LinkMessageEnvelope<SessionDescriptionEnvelope<FileRequest>>> = {
                recipient: action.payload.ownerUserName,
                payload: offerEnvelope
            }
            yield put(BdapActions.sendLinkMessage(routeEnvelope))
            yield put(RtcActions.fileReceiveProgress({ fileRequest, downloadedBytes: 0, totalBytes: 0, downloadedPct: 0, status: "waiting for answer" }))

            const pred = (action: BdapActions) => {
                switch (action.type) {
                    case getType(BdapActions.linkMessageReceived):
                        return action.payload.message.type === "pshare-answer" && action.payload.message.id === offerEnvelope.id
                    default:
                        return false;
                }
            }



            const { linkMessage }: { linkMessage: ActionType<typeof BdapActions.linkMessageReceived> } = yield race({
                timeout: delay(60 * 1000),
                linkMessage: take(pred)
            })

            if (!linkMessage) {
                yield put(RtcActions.fileReceiveFailed({ fileRequest, error: Error("timeout") }))
                yield delay(10000)
                yield put(RtcActions.fileReceiveReset(fileRequest))
                return
            }
            const answerEnvelope: LinkMessageEnvelope<SessionDescriptionEnvelope<FileInfo>> = linkMessage.payload.message
            yield put(RtcActions.fileReceiveProgress({ fileRequest, downloadedBytes: 0, totalBytes: 0, downloadedPct: 0, status: "connecting to peer" }))

            const { payload: { sessionDescription: answerSdp, payload: fileInfo } } = answerEnvelope

            const answerSessionDescription = new RTCSessionDescription(answerSdp);
            yield call(() => peer.setRemoteDescription(answerSessionDescription))
            yield call(() => peer.waitForDataChannelOpen())
            yield put(RtcActions.fileReceiveProgress({ fileRequest, downloadedBytes: 0, totalBytes: 0, downloadedPct: 0, status: "connected to peer" }))


            const otherEndUser = action.payload.ownerUserName
            const { temp }: UserSharePaths = yield getOrCreateShareDirectoriesForUser(otherEndUser);
            const tempPath = path.join(temp, `__${uuid()}`)

            //debugger
            try {
                yield receiveFileFromRTCPeer(tempPath, peer, fileInfo, fileRequest)
            } catch (err) {
                yield put(RtcActions.fileReceiveFailed({ fileRequest, error: prepareErrorForSerialization(err) }))
                yield delay(10000)
                yield put(RtcActions.fileReceiveReset(fileRequest))
                return
            }


            yield call(() => fs.promises.rename(tempPath, fileRequest.savePath));
            yield put(RtcActions.fileReceiveSuccess(fileRequest))
            yield delay(10000)
            yield put(RtcActions.fileReceiveReset(fileRequest))

        }
        finally {
            peer.close()
        }
    })
}
