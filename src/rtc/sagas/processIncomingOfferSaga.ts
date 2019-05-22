import { takeEvery, call, put, select } from "redux-saga/effects";
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
import { FileRequest } from "../../shared/actions/payloadTypes/FileRequest";
import { RtcRootState } from "../reducers";
import { SharedFile } from "../../shared/types/SharedFile";
import { blinq } from "blinq";
import { BdapActions } from "../../shared/actions/bdap";

export function* processIncomingOfferSaga() {
    yield takeEvery(getType(FileSharingActions.offerEnvelopeReceived), function* (action: ActionType<typeof FileSharingActions.offerEnvelopeReceived>) {
        const { payload: offerEnvelope } = action;
        const rtcConfig: RTCConfiguration = yield select((s: RtcRootState) => s.rtcConfig)
        const answerPeer: PromiseType<ReturnType<typeof getAnswerPeer>> = yield call(() => getAnswerPeer(rtcConfig));
        const { sessionDescription: offerSdp, id: transactionId, payload: fileRequest } = offerEnvelope;
        console.log(fileRequest);
        const offerSessionDescription = new RTCSessionDescription(offerSdp);
        const answer: RTCSessionDescription = yield call(() => answerPeer.getAnswer(offerSessionDescription));
        const internalFileInfo: InternalFileInfo | null = yield getFileInfo(fileRequest);
        if (!internalFileInfo) {
            console.warn("could not retrieve file info for file request")
            return
        }
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
        yield put(BdapActions.sendLinkMessage(routeEnvelope));
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


function getFileInfo(fileRequest: FileRequest) {
    return call(function* () {
        const sharedFiles: SharedFile[] =
            yield select((s: RtcRootState) =>
                (s.fileWatch.users[fileRequest.requestorUserName] && Object.values(s.fileWatch.users[fileRequest.requestorUserName].out)) || [])
        const sharedFile = blinq(sharedFiles).firstOrDefault(f => f.hash === fileRequest.fileId)
        if (typeof sharedFile === 'undefined') {
            return null
        }
        const output: InternalFileInfo = {
            localPath: sharedFile.path,
            type: sharedFile.contentType!,
            size: sharedFile.size!,
            path: sharedFile.relativePath
        };
        return output;
    });
}
