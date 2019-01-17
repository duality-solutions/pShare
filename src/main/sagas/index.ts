import { initializationSaga } from "./initializationSaga";
import { loggingSaga } from "./loggingSaga";
import storeHydrationSaga from "./storeHydrationSaga";

export const getRootSaga = () => {
    return [loggingSaga, initializationSaga, storeHydrationSaga]
}