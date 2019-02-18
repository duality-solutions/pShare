import { initializationSaga } from "./initializationSaga";
import { loggingSaga } from "./loggingSaga";
import { storeHydrationSaga } from "./storeHydrationSaga";
import { validationSaga } from "./validationSaga";
import { onboardingSaga } from "./onboardingSaga";
import { createBdapAccountSaga } from "./createBdapAccountSaga";
import { setWalletPasswordSaga } from "./setWalletPasswordSaga";
import { mnemonicSaga } from "./mnemonicSaga";
import { saveMnemonicSaga } from "./saveMnemonicSaga";
import { BrowserWindowProvider } from "../../shared/system/BrowserWindowProvider";
import { translateMnemonicFileSaveFailedActionsToValidationMessages } from "./translateMnemonicFileSaveFailedActionsToValidationMessages";
import { shutdownSaga } from "./shutdownSaga";

export const getRootSaga = (browserWindowProvider: BrowserWindowProvider) => [
    loggingSaga,
    () => initializationSaga(),
    () => storeHydrationSaga(),
    () => validationSaga(),
    () => onboardingSaga(),
    () => createBdapAccountSaga(true),
    () => setWalletPasswordSaga(true),
    () => mnemonicSaga(),
    () => saveMnemonicSaga(browserWindowProvider),
    translateMnemonicFileSaveFailedActionsToValidationMessages,
    () => shutdownSaga()
]

