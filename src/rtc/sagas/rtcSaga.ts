import { getOfferPeer } from "../system/webRtc/getOfferPeer";
import { call, takeEvery, put, select, take } from "redux-saga/effects";
import { getAnswerPeer } from "../system/webRtc/getAnswerPeer";
import { getType, ActionType } from "typesafe-actions";
import { RtcActions } from "../../shared/actions/rtc";
import { RendererRootState } from "../../renderer/reducers";
import * as fs from 'fs'
import { createPromiseResolver } from "../../shared/system/createPromiseResolver";
import { delay } from "redux-saga";
import { FileActions } from "../../shared/actions/file";
import * as path from 'path'
import { v4 as uuid } from 'uuid';
import * as util from 'util'
import { PromiseType } from "../../shared/system/generic-types/PromiseType";
import { toArrayBuffer, toBuffer } from "../../shared/system/bufferConversion";
import { FilePathInfo } from "../../renderer/components/RtcPlayground/Dropzone";

export interface FileNameInfo {
    name: string
    type: string
    size: number
}

interface OfferWrapper {
    fileNameInfo: FileNameInfo,
    sessionDescription: any
}

const fileReadBufferSize = 65536; // 64KiB
const maxSendBuffered = 2097152; // 2MiB
const sendBufferedAmountLowThreshold = 262144; // 256KiB

const open = util.promisify(fs.open)
const close = util.promisify(fs.close)
const read = util.promisify(fs.read)
const write = util.promisify(fs.write)
const rename = util.promisify(fs.rename)
const unlink = util.promisify(fs.unlink)

export function* rtcSaga() {
    yield takeEvery(getType(FileActions.filesSelected), function* (action: ActionType<typeof FileActions.filesSelected>) {
        const offerPeer: PromiseType<ReturnType<typeof getOfferPeer>> = yield call(() => getOfferPeer())
        const offer: RTCSessionDescription = yield call(() => offerPeer.createOffer())
        const filePathInfo = action.payload[0];
        const fileNameInfo: FileNameInfo = { type: filePathInfo.type, size: filePathInfo.size, name: path.basename(filePathInfo.path) }
        const offerMessage: OfferWrapper = { sessionDescription: offer.toJSON(), fileNameInfo };
        yield put(RtcActions.createOfferSuccess(JSON.stringify(offerMessage)))
        yield take(getType(RtcActions.setAnswerFromRemote))
        const answerSdpJson: string = yield select((state: RendererRootState) => state.rtcPlayground.text)
        const answerSdp = JSON.parse(answerSdpJson)
        const answerSessionDescription = new RTCSessionDescription(answerSdp);
        yield call(() => offerPeer.setRemoteDescription(answerSessionDescription))
        const dc: RTCDataChannel = yield call(() => offerPeer.waitForDataChannelOpen())
        try {
            yield copyFileToDataChannel(filePathInfo, dc)
        } catch{
            yield put(RtcActions.fileSendFailed())
            return
        } finally {
            dc.close()
        }
        yield put(RtcActions.fileSendSuccess())
    })

    yield takeEvery(getType(RtcActions.createAnswer), function* (action: ActionType<typeof RtcActions.createAnswer>) {
        const answerPeer: PromiseType<ReturnType<typeof getAnswerPeer>> = yield call(() => getAnswerPeer())
        const offerSdpJson: string = yield select((state: RendererRootState) => state.rtcPlayground.text)
        const { fileNameInfo, sessionDescription: offerSdp }: OfferWrapper = JSON.parse(offerSdpJson)
        //const { name, size } = fileNameInfo
        const offerSessionDescription = new RTCSessionDescription(offerSdp);
        const answer: RTCSessionDescription = yield call(() => answerPeer.getAnswer(offerSessionDescription))
        yield put(RtcActions.createAnswerSuccess(JSON.stringify(answer.toJSON())))
        const tempPath = `/home/spender/Desktop/__${uuid()}`
        yield call(() => answerPeer.waitForDataChannelOpen())
        try {
            yield receiveFileFromAnswerPeer(tempPath, answerPeer, fileNameInfo.size)
        } catch{
            yield put(RtcActions.fileReceiveFailed())
            return
        }
        const safeName = path.basename(path.normalize(fileNameInfo.name))
        const targetPath = `/home/spender/Desktop/__${safeName}`
        yield call(() => rename(tempPath, targetPath))
        console.log("file received")
        yield put(RtcActions.fileReceiveSuccess())
    })
}

const receiveFileFromAnswerPeer = (savePath: string, answerPeer: PromiseType<ReturnType<typeof getAnswerPeer>>, size: number) =>
    call(function* () {
        try {
            const fd: number = yield call(() => open(savePath, "w"))
            try {

                let total = 0
                for (; ;) {
                    const msg: ArrayBuffer = yield call(() => answerPeer.incomingMessageQueue.receive())
                    total += msg.byteLength
                    console.log(`answerpeer received : ${total}`)
                    yield call(() => write(fd, toBuffer(msg)))
                    if (total > size) {
                        throw Error("more data than expected")
                    }
                    if (total === size) {
                        break
                    }
                }
            } finally {
                yield call(() => close(fd))
            }
        } catch (err) {
            try {
                yield call(() => unlink(savePath))
            } catch{ }
            throw err
        } finally {
            answerPeer.close()
        }
    })

const copyFileToDataChannel = (filePathInfo: FilePathInfo, dc: RTCDataChannel) =>
    call(function* () {
        dc.bufferedAmountLowThreshold = sendBufferedAmountLowThreshold;
        let totalCopied = 0
        let totalSent = 0
        const filePath = filePathInfo.path;
        var buffer = new Buffer(fileReadBufferSize);
        const fd = yield call(() => open(filePath, "r"))
        for (; ;) {
            console.log("reading chunk")
            const amtToRead = Math.min(filePathInfo.size - totalCopied, fileReadBufferSize)
            const { bytesRead }: { bytesRead: number } = yield call(() => read(fd, buffer, 0, amtToRead, totalCopied))
            console.log("chunk read")
            if (bytesRead === 0) {
                if (totalSent !== filePathInfo.size || totalSent !== totalCopied) {
                    throw Error("transfer length mismatch")
                }
                break
            }
            totalCopied += bytesRead
            if (dc.bufferedAmount > maxSendBuffered) {
                console.log("buffer high")
                const pr = createPromiseResolver()
                dc.onbufferedamountlow = () => pr.resolve()
                yield call(() => pr.promise)
                console.log("buffer emptied")
            }
            dc.send(toArrayBuffer(buffer, bytesRead))
            totalSent += bytesRead
            yield delay(0)
        }
        yield call(() => close(fd))
        while (dc.bufferedAmount > 0) {
            yield delay(250)
        }
    })