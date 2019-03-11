import { rtcAnswerPeerSaga } from "./rtcAnswerPeerSaga";
import { rtcOfferPeerSaga } from "./rtcOfferPeerSaga";

export const getRootSaga = () => {
    return [
        () => rtcAnswerPeerSaga(),
        () => rtcOfferPeerSaga()
    ]
}