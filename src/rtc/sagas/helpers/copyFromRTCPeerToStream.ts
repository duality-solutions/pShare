import { call, race, take } from "redux-saga/effects";
import { RTCPeer } from "../../system/webRtc/RTCPeer";
//import * as util from "util";
//import * as fs from "fs";
import { eventChannel, END } from "redux-saga";
import { createRTCPeerReadStream } from "./createRTCPeerReadStream";
import progressStream from "progress-stream";
import { Progress } from "progress-stream";
import * as stream from "stream";
import { ProgressHandler } from "./ProgressHandler";

//const fsUnlinkAsync = util.promisify(fs.unlink);

export const copyFromRTCPeerToStream = <
    T extends string,
    TData extends string | Blob | ArrayBuffer | ArrayBufferView
>(
    stream: stream.Writable,
    size: number,
    peer: RTCPeer<T, TData>,
    progressHandler?: ProgressHandler
) =>
    call(function*() {
        const len = size;
        //const writeStream = fs.createWriteStream(savePath);
        const readStream = createRTCPeerReadStream(peer, len);

        //cleanupOperations.push(() => writeStream.close());
        yield* copyStream(readStream, stream, len, progressHandler);
    });

function* copyStream(
    readStream: stream.Readable,
    writeStream: stream.Writable,
    len: number,
    progressHandler?: ProgressHandler
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

        if (progressHandler) {
            yield progressHandler(0, 0, undefined, 0, len);
        }

        // yield put(
        //     RtcActions.fileReceiveProgress({
        //         fileRequest,
        //         totalBytes: len,
        //         downloadedBytes: 0,
        //         downloadedPct: 0,
        //         speed: 0,
        //     })
        // );

        for (;;) {
            const progTake = take(progressChannel);
            const errTake = take(errorChannel);
            const endTake = take(endChannel);
            const result = yield race({
                progress: progTake,
                error: errTake,
                end: endTake,
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
                    if (progressHandler) {
                        yield progressHandler(
                            currentProgressPct,
                            p.speed,
                            p.eta,
                            p.transferred,
                            len
                        );
                    }
                    // yield put(
                    //     RtcActions.fileReceiveProgress({
                    //         fileRequest,
                    //         totalBytes: len,
                    //         downloadedBytes: p.transferred,
                    //         downloadedPct: currentProgressPct,
                    //         speed: p.speed,
                    //         eta: p.eta,
                    //     })
                    // );
                }

                if (p.remaining === 0) {
                    yield take(endChannel);
                    if (progressHandler) {
                        yield progressHandler(100, 0, 0, p.transferred, len);
                    }
                    // yield put(
                    //     RtcActions.fileReceiveProgress({
                    //         fileRequest,
                    //         totalBytes: len,
                    //         downloadedBytes: p.transferred,
                    //         downloadedPct: 100,
                    //         speed: 0,
                    //         eta: 0,
                    //     })
                    // );
                    break;
                }
            }
        }
    } finally {
        cleanupOperations.forEach(op => op());
    }
}
