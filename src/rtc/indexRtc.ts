import { configureStore } from "./store";
import { divertConsoleToStore } from "../shared/system/divertConsoleToStore";
const isDevelopment = process.env.NODE_ENV === 'development'

export function indexRtc() {
    const store = configureStore()
    if (!isDevelopment) {
        divertConsoleToStore(store, "rtc")
    }
    //store.dispatch(StoreActions.hydratePersistedData())
}