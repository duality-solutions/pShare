import { initializationSaga } from "./initializationSaga";
import { loggingSaga } from "./loggingSaga";
import { storeHydrationSaga } from "./storeHydrationSaga";
import { validationSaga } from "./validationSaga";
import { onboardingSaga } from "./onboardingSaga";
import { createBdapAccountSaga } from "./createBdapAccountSaga";
import { setWalletPasswordSaga } from "./setWalletPasswordSaga";

export const getRootSaga = () => {
    return [loggingSaga, initializationSaga, storeHydrationSaga, validationSaga, onboardingSaga, () => createBdapAccountSaga(true), () => setWalletPasswordSaga(true)]
}