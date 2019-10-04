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
import {
    resourceScope,
    ResourceScope,
} from "../../shared/system/resourceScope";
import { isFileListRequest } from "../../shared/actions/payloadTypes/FileListRequest";
import { MainRootState } from "../../main/reducers";
import { PublicSharedFile } from "../../shared/types/PublicSharedFile";
import { entries } from "../../shared/system/entries";
import { ReadableStreamBuffer } from "stream-buffers";
import * as stream from "stream";
//import { tuple } from "../../shared/system/tuple";
//import { sharedFiles } from "src/shared/reducers";
import { FileListResponse } from "../../shared/actions/payloadTypes/FileListResponse";

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

        const internalFileInfo: MessageInfo | null = yield getFileInfo(
            fileRequest
        );
        if (!internalFileInfo) {
            console.warn("could not retrieve file info for file request");

            return;
        }

        let answerPeer:
            | PromiseType<ReturnType<typeof getAnswerPeer>>
            | undefined;
        if (internalFileInfo.size > 0) {
            const rtcConfig: RTCConfiguration = yield select(
                (s: RtcRootState) => s.rtcConfig
            );
            answerPeer = yield call(() => getAnswerPeer(rtcConfig));
        }

        const scope = resourceScope(answerPeer, async peer => {
            if (peer) {
                await peer.close();
            }
        });
        yield* scope.use(function*(answerPeer) {
            const { localPath, fileInfo, alternativeStream } = (() => {
                if (isInternalFileInfo(internalFileInfo)) {
                    const {
                        localPath,
                        ...fileInfo
                    }: InternalFileInfo = internalFileInfo;
                    return { localPath, fileInfo, alternativeStream: null };
                } else if (isInternalDirectoryInfo(internalFileInfo)) {
                    const { size, type, payload } = internalFileInfo;
                    return {
                        localPath: null,
                        fileInfo: { path: "file-list", size, type },
                        alternativeStream: payload,
                    };
                } else {
                    throw Error("unexpected internalFileInfo type");
                }
            })();

            if (fileInfo != null) {
                //const { localPath, ...fileInfo } = internalFileInfo;

                yield put(
                    ClientDownloadActions.clientDownloadStarted({
                        fileRequest,
                        fileInfo,
                    })
                );
            }

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
                    let fileSize: number;
                    let scope: ResourceScope<stream.Readable>;
                    if (localPath) {
                        const stats: fs.Stats = yield call(() =>
                            fs.promises.stat(localPath)
                        );
                        fileSize = stats.size;
                        const stream = fs.createReadStream(localPath);
                        scope = resourceScope(stream, () => stream.close());
                    } else if (alternativeStream) {
                        fileSize = fileInfo.size;
                        scope = resourceScope(alternativeStream, () => {});
                    } else {
                        throw Error("no localpath or alternativeStream");
                    }

                    //const scope = resourceScope(stream, s => s.close());
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

interface MessageInfo {
    type: string;
    size: number;
}
interface InternalFileInfo extends MessageInfo {
    localPath: string;
    path: string;
}

function isInternalFileInfo(item: MessageInfo): item is InternalFileInfo {
    const x = item as InternalFileInfo;
    return x.hasOwnProperty("localPath") && x.hasOwnProperty("path");
}
interface InternalDirectoryInfo extends MessageInfo {
    requestId: string;
    payload: stream.Readable;
}
function isInternalDirectoryInfo(
    item: MessageInfo
): item is InternalDirectoryInfo {
    const x = item as InternalDirectoryInfo;
    return x.hasOwnProperty("requestId") && x.hasOwnProperty("payload");
}

function getFileInfo(fileRequest: FileRequest) {
    return call(function*() {
        if (isFileListRequest(fileRequest)) {
            const filesRecord: Record<string, SharedFile> = yield select(
                (s: MainRootState) => {
                    if (s.fileWatch.users[fileRequest.requestorUserName]) {
                        return s.fileWatch.users[fileRequest.requestorUserName]
                            .out;
                    } else {
                        return {};
                    }
                }
            );
            const sharedFiles: PublicSharedFile[] = entries(filesRecord)
                .select(([fileName, v]) => ({
                    fileName,
                    //hash: v.hash!,
                    size: v.size!,
                    contentType: v.contentType!,
                }))
                .toArray();

            const memStream = new ReadableStreamBuffer();

            const response: FileListResponse = {
                requestId: fileRequest.requestId,
                sharedFiles,
            };
            memStream.put(JSON.stringify(response));
            memStream.stop();

            const di: InternalDirectoryInfo = {
                requestId: fileRequest.requestId,
                payload: memStream,
                size: memStream.size(),
                type: "application/json",
            };
            return di;
        }
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
