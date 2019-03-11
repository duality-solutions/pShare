import { call } from "redux-saga/effects";
import { toArrayBuffer } from "../../../shared/system/bufferConversion";
import { RTCPeer } from "../../system/webRtc/RTCPeer";
import { createPromiseResolver } from "../../../shared/system/createPromiseResolver";
import { delay } from "redux-saga";
import { FilePathInfo } from "../../system/webRtc/FilePathInfo";
import * as util from 'util'
import * as fs from 'fs'

const fileReadBufferSize = 65536; // 64KiB

const maxSendBuffered = 2097152; // 2MiB

const sendBufferedAmountLowThreshold = 262144; // 256KiB

const read = util.promisify(fs.read);
const close = util.promisify(fs.close);
const open = util.promisify(fs.open);

export const copyFileToRTCPeer =
    <T extends string, TData extends string | Blob | ArrayBuffer | ArrayBufferView>
        (filePathInfo: FilePathInfo, peer: RTCPeer<T, TData>) => call(function* () {
            const dataChannel = peer.dataChannel;
            dataChannel.bufferedAmountLowThreshold = sendBufferedAmountLowThreshold;
            let totalRead = 0;
            let totalSent = 0;
            const filePath = filePathInfo.path;
            var buffer = new Buffer(fileReadBufferSize);
            const fd = yield call(() => open(filePath, "r"));
            for (; ;) {
                console.log("reading chunk");
                const amtToRead = Math.min(filePathInfo.size - totalRead, fileReadBufferSize);
                const { bytesRead }: {
                    bytesRead: number;
                } = yield call(() => read(fd, buffer, 0, amtToRead, totalRead));
                console.log("chunk read");
                if (bytesRead === 0) {
                    if (totalSent !== filePathInfo.size || totalSent !== totalRead) {
                        throw Error("transfer length mismatch");
                    }
                    break;
                }
                totalRead += bytesRead;
                if (dataChannel.bufferedAmount > maxSendBuffered) {
                    console.log("buffer high");
                    const pr = createPromiseResolver();
                    dataChannel.onbufferedamountlow = () => pr.resolve();
                    yield call(() => pr.promise);
                    console.log("buffer emptied");
                }
                dataChannel.send(toArrayBuffer(buffer, bytesRead));
                totalSent += bytesRead;
                yield delay(0);
            }
            yield call(() => close(fd));
            while (dataChannel.bufferedAmount > 0) {
                yield delay(250);
            }
        });

