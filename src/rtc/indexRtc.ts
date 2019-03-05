import { configureStore } from "./store";
import { divertConsoleToStore } from "../shared/system/divertConsoleToStore";
import { StoreActions } from "../shared/actions/store";

export function indexRtc() {
    const store = configureStore()
    divertConsoleToStore(store, "rtc")
    store.dispatch(StoreActions.hydratePersistedData())
}