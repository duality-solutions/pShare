import { call, put, race, take } from "redux-saga/effects";
import { RTCPeer } from "../../system/webRtc/RTCPeer";
import * as util from "util";
import * as fs from "fs";
import { FileInfo } from "../../../shared/actions/payloadTypes/FileInfo";
import { FileRequest } from "../../../shared/actions/payloadTypes/FileRequest";
import { RtcActions } from "../../../shared/actions/rtc";
import { eventChannel, END } from "redux-saga";
import { createRTCPeerReadStream } from "./createRTCPeerReadStream";
import progressStream from "progress-stream";
import { Progress } from "progress-stream";
import * as stream from "stream";

const fsUnlinkAsync = util.promisify(fs.unlink);

export const receiveFileFromRTCPeer = <
    T extends string,
    TData extends string | Blob | ArrayBuffer | ArrayBufferView
>(
    savePath: string,
    peer: RTCPeer<T, TData>,
    fileNameInfo: FileInfo,
    fileRequest: FileRequest
) =>
    call(function*() {
        const cleanupOperations: (() => void)[] = [];

        try {
            try {
                const len = fileNameInfo.size;
                const writeStream = fs.createWriteStream(savePath);
                const readStream = createRTCPeerReadStream(peer, len);

                cleanupOperations.push(() => writeStream.close());
                yield* copyStream(readStream, writeStream, len, fileRequest);
            } finally {
                cleanupOperations.forEach(op => op());
            }
        } catch (err) {
            try {
                yield call(() => fsUnlinkAsync(savePath));
            } catch {}
            throw err;
        } finally {
            peer.close();
        }
    });

function* copyStream(
    readStream: stream.Readable,
    writeStream: stream.Writable,
    len: number,
    fileRequest: FileRequest
) {
    const cleanupOperations: (() => void)[] = [];
    try {
        const progStream = progressStream({ length: len, time: 500 });
        const progressChannel = eventChannel<Progress>(emitter => {
            const handler = (progress: Progress) => {
                emitter(progress);
                if (progress.remaining === 0) {
                    emitter(END);
                }
            };
            progStream.on("progress", handler);
            return () => progStream.off("progress", handler);
        });
        cleanupOperations.push(() => progressChannel.close());

        const pipe = readStream.pipe(progStream).pipe(writeStream);
        const errorChannel = eventChannel<Error>(emitter => {
            const handler = (err: Error) => emitter(err);
            pipe.on("error", handler);
            return () => pipe.off("error", handler);
        });
        cleanupOperations.push(() => errorChannel.close());

        const endChannel = eventChannel<{}>(emitter => {
            const handler = () => emitter({});
            pipe.on("finish", handler);
            return () => pipe.off("finish", handler);
        });
        cleanupOperations.push(() => endChannel.close());
        let currentProgressPct = 0;
        yield put(
            RtcActions.fileReceiveProgress({
                fileRequest,
                totalBytes: len,
                downloadedBytes: 0,
                downloadedPct: 0,
                speed: 0
            })
        );

        for (;;) {
            const progTake = take(progressChannel);
            const errTake = take(errorChannel);
            const endTake = take(endChannel);
            const result = yield race({
                progress: progTake,
                error: errTake,
                end: endTake
            });
            if (result.err) {
                throw result.err;
            }
            if (result.end) {
                throw Error("unexpected end");
            }
            if (result.progress) {
                const p: Progress = result.progress;
                const newPct = Math.trunc(p.percentage);
                if (newPct !== currentProgressPct) {
                    currentProgressPct = newPct;
                    yield put(
                        RtcActions.fileReceiveProgress({
                            fileRequest,
                            totalBytes: len,
                            downloadedBytes: p.transferred,
                            downloadedPct: currentProgressPct,
                            speed: p.speed,
                            eta: p.eta
                        })
                    );
                }

                if (p.remaining === 0) {
                    yield take(endChannel);
                    yield put(
                        RtcActions.fileReceiveProgress({
                            fileRequest,
                            totalBytes: len,
                            downloadedBytes: p.transferred,
                            downloadedPct: 100,
                            speed: 0,
                            eta: 0
                        })
                    );
                    break;
                }
            }
        }
    } finally {
        cleanupOperations.forEach(op => op());
    }
}
