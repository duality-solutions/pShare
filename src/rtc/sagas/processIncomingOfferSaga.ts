import { takeEvery, call, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { FileSharingActions } from "../../shared/actions/fileSharing";
import { LinkRouteEnvelope } from "../../shared/actions/payloadTypes/LinkRouteEnvelope";
import { LinkMessageEnvelope } from "../../shared/actions/payloadTypes/LinkMessageEnvelope";
import { FileInfo } from "../../shared/actions/payloadTypes/FileInfo";
import { PromiseType } from "../../shared/system/generic-types/PromiseType";
import { getAnswerPeer } from "../system/webRtc/getAnswerPeer";
import { copyFileToRTCPeer } from "./helpers/copyFileToRTCPeer";
import { RtcActions } from "../../shared/actions/rtc";
import { prepareErrorForSerialization } from "../../shared/proxy/prepareErrorForSerialization";
import * as path from 'path'
import * as fs from 'fs'

export function* processIncomingOfferSaga() {
    yield takeEvery(getType(FileSharingActions.offerEnvelopeReceived), function* (action: ActionType<typeof FileSharingActions.offerEnvelopeReceived>) {
        const { payload: offerEnvelope } = action;
        const answerPeer: PromiseType<ReturnType<typeof getAnswerPeer>> = yield call(() => getAnswerPeer());
        const { sessionDescription: offerSdp, id: transactionId, payload: fileRequest } = offerEnvelope;
        console.log(fileRequest);
        const offerSessionDescription = new RTCSessionDescription(offerSdp);
        const answer: RTCSessionDescription = yield call(() => answerPeer.getAnswer(offerSessionDescription));
        const internalFileInfo: InternalFileInfo = yield getFileInfo(fileRequest.fileId);
        const { localPath, ...fileInfo } = internalFileInfo;
        const answerEnvelope: LinkMessageEnvelope<FileInfo> = {
            sessionDescription: answer.toJSON(),
            id: transactionId,
            timestamp: Math.trunc((new Date()).getTime()),
            type: "pshare-answer",
            payload: fileInfo
        };
        const routeEnvelope: LinkRouteEnvelope<LinkMessageEnvelope<FileInfo>> = {
            recipient: fileRequest.requestorUserName,
            payload: answerEnvelope
        };
        yield put(FileSharingActions.sendLinkMessage(routeEnvelope));
        yield call(() => answerPeer.waitForDataChannelOpen());
        try {
            yield copyFileToRTCPeer(localPath, answerPeer);
        }
        catch (err) {
            yield put(RtcActions.fileSendFailed(prepareErrorForSerialization(err)));
            return;
        }
        finally {
            answerPeer.dataChannel.close();
        }
        yield put(RtcActions.fileSendSuccess());
    });
}
interface InternalFileInfo {
    localPath: string;
    type: string;
    size: number;
    path: string;
}
function getFileInfo(fileId: string) {
    return call(function* () {
        const localPath = path.join(__static, "example.mp4");
        const stats: fs.Stats = yield call(() => fs.promises.stat(localPath));
        const output: InternalFileInfo = {
            localPath: localPath,
            type: "video/mp4",
            size: stats.size,
            path: "example.mp4"
        };
        return output;
    });
}
