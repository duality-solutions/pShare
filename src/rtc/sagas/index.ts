import { requestFileSaga } from "./requestFileSaga";

export const getRootSaga = () => {
    return [
        // () => rtcAnswerPeerSaga(),
        // () => rtcOfferPeerSaga()
        () => requestFileSaga()
    ]
}