import { requestFileSaga } from "./requestFileSaga";
import { processIncomingOfferSaga } from "./processIncomingOfferSaga";
import { StoreActions } from "../../shared/actions/store";
import { put, take, fork } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { RootActions } from "../../shared/actions";
import { RtcActions } from "../../shared/actions/rtc";

export const getRootSaga = () => {
    return [
        () => rtcInitializationSaga()
    ]
}

function* rtcInitializationSaga() {
    yield put(StoreActions.hydratePersistedData())
    yield take(getType(RootActions.appInitialized))
    yield put(RtcActions.rtcStoreReady())
    yield fork(() => requestFileSaga())
    yield fork(() => processIncomingOfferSaga())
}