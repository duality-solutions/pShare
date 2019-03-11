import { call } from "redux-saga/effects";
import { toBuffer } from "../../../shared/system/bufferConversion";
import { RTCPeer } from "../../system/webRtc/RTCPeer";
import { FileNameInfo } from "../../system/webRtc/FileNameInfo";
import * as util from 'util'
import * as fs from 'fs'

const fsOpenAsync = util.promisify(fs.open)
const fsCloseAsync = util.promisify(fs.close)
const fsWriteAsync = util.promisify(fs.write)
const fsUnlinkAsync = util.promisify(fs.unlink)

export const receiveFileFromRTCPeer =
    <T extends string, TData extends string | Blob | ArrayBuffer | ArrayBufferView>
        (savePath: string, peer: RTCPeer<T, TData>, fileNameInfo: FileNameInfo) => call(function* () {
            try {
                const fd: number = yield call(() => fsOpenAsync(savePath, "w"));
                try {
                    let total = 0;
                    for (; ;) {
                        const msg: ArrayBuffer = yield call(() => peer.incomingMessageQueue.receive());
                        total += msg.byteLength;
                        console.log(`answerpeer received : ${total}`);
                        yield call(() => fsWriteAsync(fd, toBuffer(msg)));
                        if (total > fileNameInfo.size) {
                            throw Error("more data than expected");
                        }
                        if (total === fileNameInfo.size) {
                            break;
                        }
                    }
                }
                finally {
                    yield call(() => fsCloseAsync(fd));
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
