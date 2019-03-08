import { getOfferPeer } from "../system/webRtc/getOfferPeer";
import { call } from "redux-saga/effects";
import { getAnswerPeer } from "../system/webRtc/getAnswerPeer";

export function* rtcSaga() {
    yield call(() => f())
    //yield put(RtcActions.rtcSessiondescriptionReceived(sd.sdp))
    //console.log("sd received :", sd.sdp)
}

const f = async (): Promise<void> => {
    const offerPeer = await getOfferPeer()
    const offer = await offerPeer.createOffer()
    const answerPeer = await getAnswerPeer()
    const answer = await answerPeer.getAnswer(offer)
    await offerPeer.setRemoteDescription(answer)
    const answerChanProm = answerPeer.waitForDataChannelOpen()
    const offerChanProm = offerPeer.waitForDataChannelOpen()
    const []=await Promise.all([offerChanProm, answerChanProm])
    
    answerPeer.send("hello world")
    const msg = await offerPeer.incomingMessageQueue.receive()
    console.log(`msg from answer peer ${msg}`)
    offerPeer.send("hello from offerPeer")
    const msg2 = await answerPeer.incomingMessageQueue.receive()
    console.log(`msg from offer peer ${msg2}`)


}