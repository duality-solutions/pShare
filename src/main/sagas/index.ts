import { validationSaga } from "./validationSaga";
import { onboardingSaga } from "./onboardingSaga";
import { createBdapAccountSaga } from "./createBdapAccount/createBdapAccountSaga";
import { setWalletPasswordSaga } from "./setWalletPasswordSaga";
import { mnemonicSaga } from "./mnemonicSaga";
import { saveMnemonicSaga } from "./saveMnemonicSaga";
import { BrowserWindowProvider } from "../../shared/system/BrowserWindowProvider";
import { translateMnemonicFileSaveFailedActionsToValidationMessagesSaga } from "./translateMnemonicFileSaveFailedActionsToValidationMessagesSaga";
import { bdapSaga } from "./bdapSaga";
import { linkRequestSaga } from "./linkRequestSaga";
import { linkAcceptSaga } from "./linkAcceptSaga";
import { fileWatchSaga } from "./fileWatchSaga";
import { linkDeclineSaga } from "./linkDeclineSaga";
import { RpcClientWrapper } from "../RpcClient";
import { addFileSaga } from "./addFileSaga";
import { startViewSharedFilesSaga } from "./startViewSharedFilesSaga";
import { scanForLinkMessagesSaga } from "./scanForLinkMessagesSaga";
import { sendLinkMessageSaga } from "./sendLinkMessageSaga";
//import { fileShareSaga } from "./fileShareSaga";
import { requestFileSaveDialogSaga } from "./fileRequestSaveDialogSaga";
import { newLinkSaga } from "./newLinkSaga";
import { restoreFromMnemonicSaga } from "./restoreFromMnemonicSaga";


export const getRootSaga = (rpcClient: RpcClientWrapper, browserWindowProvider: BrowserWindowProvider) => [
    () => startViewSharedFilesSaga(rpcClient),
    () => addFileSaga(),
    () => fileWatchSaga(),
    //() => fileShareSaga(rpcClient),
    () => linkRequestSaga(rpcClient),
    () => linkAcceptSaga(rpcClient),
    () => linkDeclineSaga(rpcClient),
    () => validationSaga(rpcClient),
    () => onboardingSaga(),
    () => createBdapAccountSaga(rpcClient),
    () => setWalletPasswordSaga(rpcClient, true),
    () => mnemonicSaga(rpcClient),
    () => saveMnemonicSaga(browserWindowProvider),
    () => translateMnemonicFileSaveFailedActionsToValidationMessagesSaga(),
    () => bdapSaga(rpcClient),
    () => scanForLinkMessagesSaga(rpcClient),
    () => sendLinkMessageSaga(rpcClient),
    () => requestFileSaveDialogSaga(browserWindowProvider),
    () => newLinkSaga(),
    () => restoreFromMnemonicSaga(rpcClient)
]

