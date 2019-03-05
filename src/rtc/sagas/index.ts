import { rtcSaga } from "./rtcSaga";

export const getRootSaga = () => {
    return [
        () => rtcSaga()
    ]
}