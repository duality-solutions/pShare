import { getOfferPeer } from "../system/webRtc/getOfferPeer";
import { call, takeEvery, put, select } from "redux-saga/effects";
import { getAnswerPeer } from "../system/webRtc/getAnswerPeer";
import { getType, ActionType } from "typesafe-actions";
import { RtcActions } from "../../shared/actions/rtc";
import { RendererRootState } from "../../renderer/reducers";

type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends (...args: any[]) => Promise<infer U> ? U :
    T

export function* rtcSaga() {

    yield takeEvery(getType(RtcActions.createOffer), function* (action: ActionType<typeof RtcActions.createOffer>) {
        const offerPeer: ThenArg<ReturnType<typeof getOfferPeer>> = yield call(() => getOfferPeer())
        const offer: RTCSessionDescription = yield call(() => offerPeer.createOffer())
        yield put(RtcActions.createOfferSuccess(JSON.stringify(offer.toJSON())))
    })
    yield takeEvery(getType(RtcActions.createAnswer), function* (action: ActionType<typeof RtcActions.createAnswer>) {
        const answerPeer: ThenArg<ReturnType<typeof getAnswerPeer>> = yield call(() => getAnswerPeer())
        console.log("got answer peer")
        const offerSdpJson: string = yield select((state: RendererRootState) => state.rtcPlayground.text)
        console.log("got offerSdpJson")
        const offerSdp = JSON.parse(offerSdpJson)
        console.log("got offerSdp")
        const answer: RTCSessionDescription = yield call(() => answerPeer.getAnswer(new RTCSessionDescription(offerSdp)))
        console.log("got answer")
        yield put(RtcActions.createAnswerSuccess(JSON.stringify(answer.toJSON())))
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