import { configureStore } from "./store";
import { divertConsoleToStore } from "../shared/system/divertConsoleToStore";

export function indexRtc() {
    const store = configureStore()
    divertConsoleToStore(store, "rtc")
}