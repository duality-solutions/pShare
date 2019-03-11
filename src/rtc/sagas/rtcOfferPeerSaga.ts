import { getOfferPeer } from "../system/webRtc/getOfferPeer";
import { call, takeEvery, put, select, take } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { RtcActions } from "../../shared/actions/rtc";
import { RendererRootState } from "../../renderer/reducers";
import { FileActions } from "../../shared/actions/file";
import * as path from 'path'
import { PromiseType } from "../../shared/system/generic-types/PromiseType";
import { copyFileToRTCPeer } from "./helpers/copyFileToRTCPeer";
import { FileNameInfo } from "../system/webRtc/FileNameInfo";
import { OfferWrapper } from "../system/webRtc/OfferWrapper";



export function* rtcOfferPeerSaga() {
    yield takeEvery(getType(FileActions.filesSelected), function* (action: ActionType<typeof FileActions.filesSelected>) {
        const peer: PromiseType<ReturnType<typeof getOfferPeer>> = yield call(() => getOfferPeer())
        const offer: RTCSessionDescription = yield call(() => peer.createOffer())
        const filePathInfo = action.payload[0];
        const fileNameInfo: FileNameInfo = { type: filePathInfo.type, size: filePathInfo.size, name: path.basename(filePathInfo.path) }
        const offerMessage: OfferWrapper = { sessionDescription: offer.toJSON(), fileNameInfo };
        yield put(RtcActions.createOfferSuccess(JSON.stringify(offerMessage)))
        yield take(getType(RtcActions.setAnswerFromRemote))
        const answerSdpJson: string = yield select((state: RendererRootState) => state.rtcPlayground.text)
        const answerSdp = JSON.parse(answerSdpJson)
        const answerSessionDescription = new RTCSessionDescription(answerSdp);
        yield call(() => peer.setRemoteDescription(answerSessionDescription))
        const dc: RTCDataChannel = yield call(() => peer.waitForDataChannelOpen())
        try {
            yield copyFileToRTCPeer(filePathInfo, peer)
        } catch (err) {
            yield put(RtcActions.fileSendFailed())
            return
        } finally {
            dc.close()
        }
        yield put(RtcActions.fileSendSuccess())
    })
}

