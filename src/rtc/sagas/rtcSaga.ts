import { getOfferPeer } from "../system/webRtc/getOfferPeer";
import { call, takeEvery, put, select, take } from "redux-saga/effects";
import { getAnswerPeer } from "../system/webRtc/getAnswerPeer";
import { getType, ActionType } from "typesafe-actions";
import { RtcActions } from "../../shared/actions/rtc";
import { RendererRootState } from "../../renderer/reducers";
import * as fs from 'fs'
import { FileActions } from "../../shared/actions/file";
import * as path from 'path'
import { v4 as uuid } from 'uuid';
import * as util from 'util'
import { PromiseType } from "../../shared/system/generic-types/PromiseType";
import { receiveFileFromAnswerPeer } from "./helpers/receiveFileFromAnswerPeer";
import { copyFileToRTCPeer } from "./helpers/copyFileToRTCPeer";
import { FileNameInfo } from "../system/webRtc/FileNameInfo";
import { OfferWrapper } from "../system/webRtc/OfferWrapper";

export const open = util.promisify(fs.open)
export const close = util.promisify(fs.close)
export const write = util.promisify(fs.write)
const rename = util.promisify(fs.rename)
export const unlink = util.promisify(fs.unlink)

export function* rtcSaga() {
    yield takeEvery(getType(FileActions.filesSelected), function* (action: ActionType<typeof FileActions.filesSelected>) {
        const offerPeer: PromiseType<ReturnType<typeof getOfferPeer>> = yield call(() => getOfferPeer())
        const offer: RTCSessionDescription = yield call(() => offerPeer.createOffer())
        const filePathInfo = action.payload[0];
        const fileNameInfo: FileNameInfo = { type: filePathInfo.type, size: filePathInfo.size, name: path.basename(filePathInfo.path) }
        const offerMessage: OfferWrapper = { sessionDescription: offer.toJSON(), fileNameInfo };
        yield put(RtcActions.createOfferSuccess(JSON.stringify(offerMessage)))
        yield take(getType(RtcActions.setAnswerFromRemote))
        const answerSdpJson: string = yield select((state: RendererRootState) => state.rtcPlayground.text)
        const answerSdp = JSON.parse(answerSdpJson)
        const answerSessionDescription = new RTCSessionDescription(answerSdp);
        yield call(() => offerPeer.setRemoteDescription(answerSessionDescription))
        const dc: RTCDataChannel = yield call(() => offerPeer.waitForDataChannelOpen())
        try {
            yield copyFileToRTCPeer(filePathInfo, offerPeer)
        } catch{
            yield put(RtcActions.fileSendFailed())
            return
        } finally {
            dc.close()
        }
        yield put(RtcActions.fileSendSuccess())
    })

    yield takeEvery(getType(RtcActions.createAnswer), function* () {
        const answerPeer: PromiseType<ReturnType<typeof getAnswerPeer>> = yield call(() => getAnswerPeer())
        const offerSdpJson: string = yield select((state: RendererRootState) => state.rtcPlayground.text)
        const { fileNameInfo, sessionDescription: offerSdp }: OfferWrapper = JSON.parse(offerSdpJson)
        //const { name, size } = fileNameInfo
        const offerSessionDescription = new RTCSessionDescription(offerSdp);
        const answer: RTCSessionDescription = yield call(() => answerPeer.getAnswer(offerSessionDescription))
        yield put(RtcActions.createAnswerSuccess(JSON.stringify(answer.toJSON())))
        const tempPath = `/home/spender/Desktop/__${uuid()}`
        yield call(() => answerPeer.waitForDataChannelOpen())
        try {
            yield receiveFileFromAnswerPeer(tempPath, answerPeer, fileNameInfo)
        } catch{
            yield put(RtcActions.fileReceiveFailed())
            return
        }
        const safeName = path.basename(path.normalize(fileNameInfo.name))
        const targetPath = `/home/spender/Desktop/__${safeName}`
        yield call(() => rename(tempPath, targetPath))
        console.log("file received")
        yield put(RtcActions.fileReceiveSuccess())
    })
}

