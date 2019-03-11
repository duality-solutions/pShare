import { call } from "redux-saga/effects";
import { toBuffer } from "../../../shared/system/bufferConversion";
import { RTCPeer } from "../../system/webRtc/RTCPeer";
import { open, write, close, unlink } from "../rtcSaga";
import { FileNameInfo } from "../../system/webRtc/FileNameInfo";

export const receiveFileFromAnswerPeer = <T extends string, TData extends string | Blob | ArrayBuffer | ArrayBufferView>(savePath: string, answerPeer: RTCPeer<T, TData>, fileNameInfo: FileNameInfo) => call(function* () {
    try {
        const fd: number = yield call(() => open(savePath, "w"));
        try {
            let total = 0;
            for (; ;) {
                const msg: ArrayBuffer = yield call(() => answerPeer.incomingMessageQueue.receive());
                total += msg.byteLength;
                console.log(`answerpeer received : ${total}`);
                yield call(() => write(fd, toBuffer(msg)));
                if (total > fileNameInfo.size) {
                    throw Error("more data than expected");
                }
                if (total === fileNameInfo.size) {
                    break;
                }
            }
        }
        finally {
            yield call(() => close(fd));
        }
    }
    catch (err) {
        try {
            yield call(() => unlink(savePath));
        }
        catch { }
        throw err;
    }
    finally {
        answerPeer.close();
    }
});
