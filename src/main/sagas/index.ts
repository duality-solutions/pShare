import { initializationSaga } from "./initializationSaga";
import { actionLoggingSaga } from "./actionLoggingSaga";
import { storeHydrationSaga } from "./storeHydrationSaga";
import { validationSaga } from "./validationSaga";
import { onboardingSaga } from "./onboardingSaga";
import { createBdapAccountSaga } from "./createBdapAccountSaga";
import { setWalletPasswordSaga } from "./setWalletPasswordSaga";
import { mnemonicSaga } from "./mnemonicSaga";
import { saveMnemonicSaga } from "./saveMnemonicSaga";
import { BrowserWindowProvider } from "../../shared/system/BrowserWindowProvider";
import { translateMnemonicFileSaveFailedActionsToValidationMessages } from "./translateMnemonicFileSaveFailedActionsToValidationMessages";
import { bdapSaga } from "./bdapSaga";
import { remoteLoggingSaga } from "./remoteLoggingSaga";
import { linkRequestSaga } from "./linkRequestSaga";


export const getRootSaga = (browserWindowProvider: BrowserWindowProvider) => [
    () => linkRequestSaga(),
    () => actionLoggingSaga("Main Store"),
    () => remoteLoggingSaga(),
    () => initializationSaga(),
    () => storeHydrationSaga(),
    () => validationSaga(),
    () => onboardingSaga(),
    () => createBdapAccountSaga(),
    () => setWalletPasswordSaga(true),
    () => mnemonicSaga(),
    () => saveMnemonicSaga(browserWindowProvider),
    () => translateMnemonicFileSaveFailedActionsToValidationMessages(),
    () => bdapSaga(),

]

