import { call, put } from "redux-saga/effects";
import { toBuffer } from "../../../shared/system/bufferConversion";
import { RTCPeer } from "../../system/webRtc/RTCPeer";
import * as util from 'util'
import * as fs from 'fs'
import { FileInfo } from "../../../shared/actions/payloadTypes/FileInfo";
import { FileRequest } from "../../../shared/actions/payloadTypes/FileRequest";
import { RtcActions } from "../../../shared/actions/rtc";

const fsOpenAsync = util.promisify(fs.open)
const fsCloseAsync = util.promisify(fs.close)
const fsWriteAsync = util.promisify(fs.write)
const fsUnlinkAsync = util.promisify(fs.unlink)

export const receiveFileFromRTCPeer =
    <T extends string, TData extends string | Blob | ArrayBuffer | ArrayBufferView>
        (savePath: string, peer: RTCPeer<T, TData>, fileNameInfo: FileInfo, fileRequest: FileRequest) => call(function* () {
            try {
                const fileDescriptor: number = yield call(() => fsOpenAsync(savePath, "w"));
                try {
                    let total = 0;
                    for (; ;) {
                        const msg: ArrayBuffer = yield call(() => peer.incomingMessageQueue.receive());
                        total += msg.byteLength;
                        console.log(`answerpeer received : ${total}`);
                        yield call(() => fsWriteAsync(fileDescriptor, toBuffer(msg)));
                        if (total > fileNameInfo.size) {
                            throw Error("more data than expected");
                        }
                        if (total === fileNameInfo.size) {
                            break;
                        }
                        yield put(RtcActions.fileReceiveProgress({ fileRequest, totalBytes: fileNameInfo.size, downloadedBytes: total }))
                    }
                }
                finally {
                    yield call(() => fsCloseAsync(fileDescriptor));
                }
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
