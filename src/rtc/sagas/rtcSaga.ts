import { getOfferPeer } from "../system/webRtc/getOfferPeer";
import { call, takeEvery, put } from "redux-saga/effects";
import { getAnswerPeer } from "../system/webRtc/getAnswerPeer";
import { getType, ActionType } from "typesafe-actions";
import { RtcActions } from "../../shared/actions/rtc";

type ThenArg<T> = T extends Promise<infer U> ? U :
    T extends (...args: any[]) => Promise<infer U> ? U :
    T

export function* rtcSaga() {

    yield takeEvery(getType(RtcActions.createOffer), function* (action: ActionType<typeof RtcActions.createOffer>) {
        const offerPeer: ThenArg<ReturnType<typeof getOfferPeer>> = yield call(() => getOfferPeer())
        const offer: RTCSessionDescription = yield call(() => offerPeer.createOffer())
        yield put(RtcActions.createOfferSuccess(offer.sdp))
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