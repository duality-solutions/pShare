import { requestFileSaga, processIncomingOfferSaga } from "./requestFileSaga";

export const getRootSaga = () => {
    return [
        // () => rtcAnswerPeerSaga(),
        // () => rtcOfferPeerSaga()
        () => requestFileSaga(),
        () => processIncomingOfferSaga()
    ]
}