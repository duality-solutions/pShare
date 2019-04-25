import { requestFileSaga } from "./requestFileSaga";
import { processIncomingOfferSaga } from "./processIncomingOfferSaga";

export const getRootSaga = () => {
    return [
        // () => rtcAnswerPeerSaga(),
        // () => rtcOfferPeerSaga()
        () => requestFileSaga(),
        () => processIncomingOfferSaga()
    ]
}