import { takeEvery, call, put, select } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { LinkRouteEnvelope } from "../../shared/actions/payloadTypes/LinkRouteEnvelope";
import { LinkMessageEnvelope } from "../../shared/actions/payloadTypes/LinkMessageEnvelope";
import { FileInfo } from "../../shared/actions/payloadTypes/FileInfo";
import { PromiseType } from "../../shared/system/generic-types/PromiseType";
import { getAnswerPeer } from "../system/webRtc/getAnswerPeer";
import { copyStreamToRTCPeer } from "./helpers/copyStreamToRTCPeer";
import { RtcActions } from "../../shared/actions/rtc";
import { prepareErrorForSerialization } from "../../shared/proxy/prepareErrorForSerialization";
import { FileRequest } from "../../shared/actions/payloadTypes/FileRequest";
import { RtcRootState } from "../reducers";
import { SharedFile } from "../../shared/types/SharedFile";
import { blinq } from "blinq";
import { BdapActions } from "../../shared/actions/bdap";
import { SessionDescriptionEnvelope } from "../../shared/actions/payloadTypes/SessionDescriptionEnvelope";
import { ClientDownloadActions } from "../../shared/actions/clientDownload";
import * as fs from "fs";
import { resourceScope } from "../../shared/system/resourceScope";
import { delay } from "../../shared/system/delay";

export function* processIncomingOfferSaga() {
    const pred = (action: BdapActions) => {
        switch (action.type) {
            case getType(BdapActions.linkMessageReceived):
                return action.payload.message.type === "pshare-offer";
            default:
                return false;
        }
    };
    yield takeEvery(pred, function*(
        action: ActionType<typeof BdapActions.linkMessageReceived>
    ) {
        const offerEnvelope: LinkMessageEnvelope<
            SessionDescriptionEnvelope<FileRequest>
        > = action.payload.message;
        const {
            id: transactionId,
            payload: { sessionDescription: offerSdp, payload: fileRequest },
        } = offerEnvelope;
        const internalFileInfo: InternalFileInfo | null = yield getFileInfo(
            fileRequest
        );
        if (!internalFileInfo) {
            console.warn("could not retrieve file info for file request");

            return;
        }
        const { localPath, ...fileInfo } = internalFileInfo;

        let answerPeer:
            | PromiseType<ReturnType<typeof getAnswerPeer>>
            | undefined;
        if (fileInfo.size > 0) {
            const rtcConfig: RTCConfiguration = yield select(
                (s: RtcRootState) => s.rtcConfig
            );
            answerPeer = yield call(() => getAnswerPeer(rtcConfig));
        }

        const scope = resourceScope(answerPeer, peer => peer && peer.close());
        yield* scope.use(function*(answerPeer) {
            yield put(
                ClientDownloadActions.clientDownloadStarted({
                    fileRequest,
                    fileInfo,
                })
            );
            let answer: RTCSessionDescription | undefined;
            try {
                if (answerPeer) {
                    console.log(fileRequest);
                    const offerSessionDescription = new RTCSessionDescription(
                        offerSdp
                    );
                    answer = yield call(() =>
                        answerPeer!.getAnswer(offerSessionDescription)
                    );
                }

                const answerEnvelope: LinkMessageEnvelope<
                    SessionDescriptionEnvelope<FileInfo>
                > = {
                    id: transactionId,
                    timestamp: Math.trunc(new Date().getTime()),
                    type: "pshare-answer",
                    payload: {
                        sessionDescription: answer
                            ? answer.toJSON()
                            : undefined,
                        payload: fileInfo,
                    },
                };
                const routeEnvelope: LinkRouteEnvelope<
                    LinkMessageEnvelope<SessionDescriptionEnvelope<FileInfo>>
                > = {
                    recipient: fileRequest.requestorUserName,
                    payload: answerEnvelope,
                };
                yield put(BdapActions.sendLinkMessage(routeEnvelope));
                if (answerPeer) {
                    yield call(() => answerPeer!.waitForDataChannelOpen());
                    const { size: fileSize }: fs.Stats = yield call(() =>
                        fs.promises.stat(localPath)
                    );
                    const scope = resourceScope(
                        fs.createReadStream(localPath),
                        s => s.close()
                    );
                    yield* scope.use(function*(readStream) {
                        try {
                            yield copyStreamToRTCPeer(
                                readStream,
                                fileSize,
                                answerPeer!,
                                (
                                    progressPct,
                                    speed,
                                    eta,
                                    downloadedBytes,
                                    size
                                ) =>
                                    put(
                                        ClientDownloadActions.clientDownloadProgress(
                                            {
                                                fileRequest,
                                                progressPct,
                                                downloadedBytes,
                                                size,
                                                speed,
                                                eta,
                                            }
                                        )
                                    )
                            );
                        } catch (err) {
                            yield put(
                                RtcActions.fileSendFailed(
                                    prepareErrorForSerialization(err)
                                )
                            );
                            return;
                        }
                        while (
                            answerPeer &&
                            answerPeer.dataChannel &&
                            answerPeer.dataChannel.bufferedAmount > 0
                        ) {
                            yield call(() => delay(250));
                        }
                    });
                }
            } finally {
                yield put(
                    ClientDownloadActions.clientDownloadComplete(fileRequest)
                );
            }
        });
    });
}
interface InternalFileInfo {
    localPath: string;
    type: string;
    size: number;
    path: string;
}

function getFileInfo(fileRequest: FileRequest) {
    return call(function*() {
        const sharedFiles: SharedFile[] = yield select(
            (s: RtcRootState) =>
                (s.fileWatch.users[fileRequest.requestorUserName] &&
                    Object.values(
                        s.fileWatch.users[fileRequest.requestorUserName].out
                    )) ||
                []
        );
        const sharedFile = blinq(sharedFiles).firstOrDefault(
            f => f.relativePath === fileRequest.fileName
        );
        if (typeof sharedFile === "undefined") {
            return null;
        }
        const output: InternalFileInfo = {
            localPath: sharedFile.path,
            type: sharedFile.contentType!,
            size: sharedFile.size!,
            path: sharedFile.relativePath,
        };
        return output;
    });
}
