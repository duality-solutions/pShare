import { call, race, take } from "redux-saga/effects";
import { RTCPeer } from "../../system/webRtc/RTCPeer";
import { eventChannel, END } from "redux-saga";
import { createRTCDataChannelWriteStream } from "./createRTCDataChannelWriteStream";
import progressStream from "progress-stream";
import { Progress } from "progress-stream";
import * as stream from "stream";

const sendBufferedAmountLowThreshold = 262144; // 256KiB
type ProgressHandler = (
    progress: number,
    speed: number,
    eta: number | undefined,
    downloadedBytes: number,
    size: number
) => any;

export const copyStreamToRTCPeer = <
    T extends string,
    TData extends string | Blob | ArrayBuffer | ArrayBufferView
>(
    stream: stream.Readable,
    size: number,
    peer: RTCPeer<T, TData>,
    progressHandler?: ProgressHandler
) =>
    call(function*() {
        const dataChannel = peer.dataChannel;
        dataChannel.bufferedAmountLowThreshold = sendBufferedAmountLowThreshold;

        const writeStream = createRTCDataChannelWriteStream(dataChannel);

        yield* copyStream(stream, writeStream, size, progressHandler);
    });

function* copyStream(
    readStream: stream.Readable,
    writeStream: stream.Writable,
    fileSize: number,
    progressHandler?: ProgressHandler
) {
    const cleanupOperations: (() => void)[] = [];
    try {
        const progStream = progressStream({ length: fileSize, time: 500 });
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
        let currentProgressPct = 0;
        if (progressHandler) {
            yield progressHandler(0, 0, undefined, 0, fileSize);
        }
        for (;;) {
            const progTake = take(progressChannel);
            const errTake = take(errorChannel);
            const result = yield race({ progress: progTake, error: errTake });
            if (result.err) {
                throw result.err;
            }
            if (result.progress) {
                const p: Progress = result.progress;
                if (progressHandler) {
                    const newPct = Math.trunc(p.percentage);
                    if (newPct !== currentProgressPct) {
                        currentProgressPct = newPct;
                        yield progressHandler(
                            currentProgressPct,
                            p.speed,
                            p.eta,
                            p.transferred,
                            p.length
                        );
                    }
                }
                if (p.remaining === 0) {
                    break;
                }
            }
        }
    } finally {
        cleanupOperations.forEach(op => op());
    }
}
