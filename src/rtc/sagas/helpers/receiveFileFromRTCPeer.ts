import { call, put, race } from "redux-saga/effects";
import { RTCPeer } from "../../system/webRtc/RTCPeer";
import * as util from 'util'
import * as fs from 'fs'
import { FileInfo } from "../../../shared/actions/payloadTypes/FileInfo";
import { FileRequest } from "../../../shared/actions/payloadTypes/FileRequest";
import { RtcActions } from "../../../shared/actions/rtc";
import * as crypto from 'crypto'
import { toBuffer } from "../../../shared/system/bufferConversion";
import { delay } from "redux-saga";

const fsOpenAsync = util.promisify(fs.open)
const fsCloseAsync = util.promisify(fs.close)
const fsWriteAsync = util.promisify(fs.write)
const fsUnlinkAsync = util.promisify(fs.unlink)

export const receiveFileFromRTCPeer =
    <T extends string, TData extends string | Blob | ArrayBuffer | ArrayBufferView>
        (savePath: string, peer: RTCPeer<T, TData>, fileNameInfo: FileInfo, fileRequest: FileRequest) => call(function* () {
            
            try {
                const shasum = crypto.createHash('sha256');
                const fileDescriptor: number = yield call(() => fsOpenAsync(savePath, "w"));
                try {
                    let total = 0;
                    let currentPct = -1
                    for (; ;) {
                        const { msg, timeout }: { msg: ArrayBuffer, timeout: any } = yield race({
                            msg: call(() => peer.incomingMessageQueue.receive()),
                            timeout: delay(120000)
                        })
                        if (timeout) {
                            throw Error("timeout")
                        }
                        total += msg.byteLength;
                        //console.log(`answerpeer received : ${total}`);

                        const buffer = toBuffer(msg, 0, msg.byteLength)
                        shasum.update(buffer)
                        yield call(() => fsWriteAsync(fileDescriptor, buffer));

                        if (total > fileNameInfo.size) {
                            throw Error("more data than expected");
                        }
                        if (total === fileNameInfo.size) {
                            break;
                        }
                        const pct = (total * 100 / fileNameInfo.size) >> 0
                        if (currentPct !== pct) {
                            currentPct = pct
                            yield put(RtcActions.fileReceiveProgress({ fileRequest, totalBytes: fileNameInfo.size, downloadedBytes: total, downloadedPct: pct }))
                        }

                    }
                }
                finally {
                    yield call(() => fsCloseAsync(fileDescriptor));
                }
                // const computedHash = shasum.digest("base64")
                // if (computedHash !== fileRequest.fileId) {
                //     throw Error("Checksum error: hash of downloaded data does not match that of requested data")
                // }
            }
            catch (err) {
                try {
                    yield call(() => fsUnlinkAsync(savePath));
                }
                catch { }
                throw err;
            }
            finally {
                peer.close();
            }

        });
