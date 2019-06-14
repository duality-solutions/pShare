import { call, race } from "redux-saga/effects";
import { toArrayBuffer } from "../../../shared/system/bufferConversion";
import { RTCPeer } from "../../system/webRtc/RTCPeer";
import { createPromiseResolver } from "../../../shared/system/createPromiseResolver";
import { delay } from "redux-saga";
import * as util from 'util'
import * as fs from 'fs'

const fileReadBufferSize = 65536; // 64KiB
const maxSendBuffered = 2097152; // 2MiB
const sendBufferedAmountLowThreshold = 262144; // 256KiB

const fsReadAsync = util.promisify(fs.read);
const fsCloseAsync = util.promisify(fs.close);
const fsOpenAsync = util.promisify(fs.open);

export const copyFileToRTCPeer =
    <T extends string, TData extends string | Blob | ArrayBuffer | ArrayBufferView>
        (filePath: string, peer: RTCPeer<T, TData>, progressHandler?: ((progress: number, downloadedBytes: number, size: number) => any)) => call(function* () {
            const dataChannel = peer.dataChannel;
            dataChannel.bufferedAmountLowThreshold = sendBufferedAmountLowThreshold;
            let totalRead = 0;
            let totalSent = 0;
            const { size: fileSize }: fs.Stats = yield call(() => fs.promises.stat(filePath))
            var buffer = new Buffer(fileReadBufferSize);
            const fileDescriptor: number = yield call(() => fsOpenAsync(filePath, "r"));
            let currentProgressPct = -1
            for (; ;) {
                console.log("reading chunk");
                const amtToRead = Math.min(fileSize - totalRead, fileReadBufferSize);
                const { bytesRead }: {
                    bytesRead: number;
                } = yield call(() => fsReadAsync(fileDescriptor, buffer, 0, amtToRead, totalRead));
                console.log("chunk read");
                if (bytesRead === 0) {
                    if (totalSent !== fileSize || totalSent !== totalRead) {
                        throw Error("transfer length mismatch");
                    }
                    break;
                }
                totalRead += bytesRead;
                if (dataChannel.bufferedAmount > maxSendBuffered) {
                    console.log("buffer high");
                    const pr = createPromiseResolver<boolean>();
                    dataChannel.onbufferedamountlow = () => pr.resolve(true);

                    const { success } = yield race({
                        timeout: call(function* () {
                            let currBufAmt = dataChannel.bufferedAmount
                            let now = performance.now()
                            let moved = false
                            for (; ;) {
                                yield delay(250)
                                moved = moved || dataChannel.bufferedAmount !== currBufAmt
                                currBufAmt = dataChannel.bufferedAmount
                                if (moved) {
                                    now = performance.now()
                                    moved = false
                                } else {
                                    if ((performance.now() - now) > 120000) {
                                        break
                                    }
                                }
                            }
                        }),
                        success: call(() => pr.promise)
                    })
                    if (!success) {
                        throw Error("timeout")
                    }


                    console.log("buffer emptied");
                }
                dataChannel.send(toArrayBuffer(buffer, 0, bytesRead));
                totalSent += bytesRead;

                const progressPct = Math.trunc((totalSent / fileSize) * 100)
                if (progressPct != currentProgressPct) {
                    currentProgressPct = progressPct
                    if (progressHandler) {
                        yield progressHandler(currentProgressPct, totalSent, fileSize)
                    }
                }
                yield delay(0);
            }
            yield call(() => fsCloseAsync(fileDescriptor));
            let bufferedAmt = dataChannel.bufferedAmount
            let now = performance.now()
            let moved = false
            while (bufferedAmt > 0) {
                yield delay(250);
                moved = moved || dataChannel.bufferedAmount !== bufferedAmt
                bufferedAmt = dataChannel.bufferedAmount
                if (moved) {
                    now = performance.now()
                    moved = false
                } else {
                    if ((performance.now() - now) > 120000) {
                        throw Error("timeout")
                    }
                }
            }
        });

