import { call, takeEvery, put, select } from "redux-saga/effects";
import { getAnswerPeer } from "../system/webRtc/getAnswerPeer";
import { getType } from "typesafe-actions";
import { RtcActions } from "../../shared/actions/rtc";
import { RendererRootState } from "../../renderer/reducers";
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuid } from 'uuid';
import * as util from 'util'
import { PromiseType } from "../../shared/system/generic-types/PromiseType";
import { receiveFileFromRTCPeer } from "./helpers/receiveFileFromRTCPeer";
import { OfferWrapper } from "../system/webRtc/OfferWrapper";

export const open = util.promisify(fs.open)
export const close = util.promisify(fs.close)
export const write = util.promisify(fs.write)
const rename = util.promisify(fs.rename)
export const unlink = util.promisify(fs.unlink)

export function* rtcAnswerPeerSaga() {
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
            yield receiveFileFromRTCPeer(tempPath, answerPeer, fileNameInfo)
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

