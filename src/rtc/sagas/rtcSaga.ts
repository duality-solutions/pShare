import { getOfferPeer } from "../system/webRtc/getOfferPeer";
import { createPromiseResolver } from "../../shared/system/createPromiseResolver";
import { call, put } from "redux-saga/effects";
import { RtcActions } from "../../shared/actions/rtc";

export function* rtcSaga() {
    const sd: RTCSessionDescription = yield call(() => f())
    yield put(RtcActions.rtcSessiondescriptionReceived(sd.sdp))
    //console.log("sd received :", sd.sdp)
}

const f = async (): Promise<RTCSessionDescription> => {
    const offerPeer = await getOfferPeer()
    const pr = createPromiseResolver<RTCSessionDescription>()


    offerPeer.once("sdp", (d: RTCSessionDescription) => pr.resolve(d))
    const sdp = await pr.promise;
    return sdp
}