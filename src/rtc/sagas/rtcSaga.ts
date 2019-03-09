import { getOfferPeer } from "../system/webRtc/getOfferPeer";
import { call, takeEvery, put, select, take } from "redux-saga/effects";
import { getAnswerPeer } from "../system/webRtc/getAnswerPeer";
import { getType, ActionType } from "typesafe-actions";
import { RtcActions } from "../../shared/actions/rtc";
import { RendererRootState } from "../../renderer/reducers";
import * as fs from 'fs'
import { createPromiseResolver } from "../../shared/system/createPromiseResolver";
import { delay } from "redux-saga";

type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends (...args: any[]) => Promise<infer U> ? U :
    T

export function* rtcSaga() {

    yield takeEvery(getType(RtcActions.createOffer), function* (action: ActionType<typeof RtcActions.createOffer>) {
        const offerPeer: ThenArg<ReturnType<typeof getOfferPeer>> = yield call(() => getOfferPeer())
        const offer: RTCSessionDescription = yield call(() => offerPeer.createOffer())
        yield put(RtcActions.createOfferSuccess(JSON.stringify(offer.toJSON())))
        yield take(getType(RtcActions.setAnswerFromRemote))

        const answerSdpJson: string = yield select((state: RendererRootState) => state.rtcPlayground.text)

        const answerSdp = JSON.parse(answerSdpJson)
        const answerSessionDescription = new RTCSessionDescription(answerSdp);
        yield call(() => offerPeer.setRemoteDescription(answerSessionDescription))
        const dc: RTCDataChannel = yield call(() => offerPeer.waitForDataChannelOpen())
        const fileStream = fs.createReadStream("/home/spender/Downloads/bigtiff3.tiff")

        const chunkSize = (1 << 10) * 64;
        const maxBuffered = (1 << 12) * 512;

        dc.bufferedAmountLowThreshold = (1 << 12) * 64;





        for (; ;) {
            yield call(() => new Promise((resolve) => {
                fileStream.once("readable", function () {
                    resolve()
                });
            }))

            console.log("reading chunk")
            //debugger
            const chunk: Buffer = fileStream.read(chunkSize)
            console.log("chunk read")
            if (chunk == null) {
                break
            }
            console.log(chunk.length);
            if (dc.bufferedAmount > maxBuffered) {
                console.log("buffer high")
                const pr = createPromiseResolver()
                dc.onbufferedamountlow = () => pr.resolve()
                yield call(() => pr.promise)
                console.log("buffer emptied")
            }
            dc.send(chunk)
            yield delay(0)
        }
        // offerPeer.send("hello from offerpeer")
        // const msg: any = yield call(() => offerPeer.incomingMessageQueue.receive())
        // console.log(`offerPeer received : ${msg}`)
    })
    yield takeEvery(getType(RtcActions.createAnswer), function* (action: ActionType<typeof RtcActions.createAnswer>) {
        const answerPeer: ThenArg<ReturnType<typeof getAnswerPeer>> = yield call(() => getAnswerPeer())
        const offerSdpJson: string = yield select((state: RendererRootState) => state.rtcPlayground.text)
        const offerSdp = JSON.parse(offerSdpJson)
        const offerSessionDescription = new RTCSessionDescription(offerSdp);
        const answer: RTCSessionDescription = yield call(() => answerPeer.getAnswer(offerSessionDescription))
        yield put(RtcActions.createAnswerSuccess(JSON.stringify(answer.toJSON())))
        const { }: RTCDataChannel = yield call(() => answerPeer.waitForDataChannelOpen())
        //answerPeer.send("hello from answerpeer")
        let total = 0
        for (; ;) {
            const msg: ArrayBuffer = yield call(() => answerPeer.incomingMessageQueue.receive())
            total += msg.byteLength
            console.log(`answerpeer received : ${total}`)

        }
    })

}

// const f = async (): Promise<void> => {
//     const offerPeer = await getOfferPeer()
//     const offer = await offerPeer.createOffer()
//     const answerPeer = await getAnswerPeer()
//     const answer = await answerPeer.getAnswer(offer)
//     await offerPeer.setRemoteDescription(answer)
//     const answerChanProm = answerPeer.waitForDataChannelOpen()
//     const offerChanProm = offerPeer.waitForDataChannelOpen()
//     const [] = await Promise.all([offerChanProm, answerChanProm])

//     answerPeer.send("hello world")
//     const msg = await offerPeer.incomingMessageQueue.receive()
//     console.log(`msg from answer peer ${msg}`)
//     offerPeer.send("hello from offerPeer")
//     const msg2 = await answerPeer.incomingMessageQueue.receive()
//     console.log(`msg from offer peer ${msg2}`)


// }