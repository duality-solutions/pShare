import { put, select, take, race } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { RootActions } from "../../../shared/actions";
import { RendererRootState } from "../../reducers";
import { appRoutes, pushRoute, dashboardRoutes } from "../../routes/appRoutes";
import { getNavMap } from "./getNavMap";
import { BdapActions } from "../../../shared/actions/bdap";
import { DashboardActions } from "../../../shared/actions/dashboard";
import { SharedFilesActions } from "../../../shared/actions/sharedFiles";
import { AddFileActions } from "../../../shared/actions/addFile";
import { AppActions } from "../../../shared/actions/app";

//const delay = (time: number) => new Promise(r => setTimeout(r, time));

export function* navSaga() {
    console.log("nav saga started")
    yield* waitForInitialized();

    yield* waitForSync();


    const currentState: RendererRootState = yield select()
    if (currentState.user.isOnboarded) {
        console.log("nav saga: user is onboarded, navigating to /Main")
        yield put(pushRoute(appRoutes.dashboard))
    }
    else {

        if (currentState.user.accountCreated) {
            yield put(pushRoute(appRoutes.passwordCreateOrLogin))
            yield* waitForWalletCredentials();
        }
        else {
            // const walletIsEncrypted: boolean = yield select((s: RendererRootState) => s.user.walletEncrypted)
            // if (walletIsEncrypted) {
            //     yield put(pushRoute(appRoutes.configError))
            //     return;
            // }
            const currentState: RendererRootState = yield select()



            if (currentState.user.accountCreationTxId) {
                yield put(pushRoute(appRoutes.creatingBdapAccount))
                const bdapAccountConfigNavMap = getNavMap();
                bdapAccountConfigNavMap.registerNavAction(RootActions.createBdapAccountComplete, appRoutes.passwordCreateOrLogin, true) //true parameter indicates stopping condition
                //this will block until the navMap is complete
                yield bdapAccountConfigNavMap.runNav();
                yield* waitForWalletCredentials();
            }
            else{
                console.log("nav saga: navigating to Onboarding -- /CreateAccount")
                yield put(pushRoute(appRoutes.createAccount))
                console.log("nav saga navigating to /CreateAccount")
                for (; ;) {
                    const { createAccount } = yield race({
                        createAccount: take(getType(RootActions.createAccount)),
                        restoreAccount: take(getType(RootActions.restoreAccount))
                    })
    
                    let returnedToCreateAccount = false
    
                    if (createAccount) {
                        yield put(pushRoute(appRoutes.enterUserName))
                        const bdapAccountConfigNavMap = getNavMap();
                        bdapAccountConfigNavMap.registerNavAction(RootActions.accountCreationCancelled, appRoutes.createAccount, true, () => returnedToCreateAccount = true)
                        bdapAccountConfigNavMap.registerNavAction(RootActions.userNameCaptured, appRoutes.enterCommonName)
                        bdapAccountConfigNavMap.registerNavAction(RootActions.commonNameCancelled, appRoutes.enterUserName)
                        bdapAccountConfigNavMap.registerNavAction(RootActions.commonNameCaptured, appRoutes.enterToken)
                        bdapAccountConfigNavMap.registerNavAction(RootActions.tokenCancelled, appRoutes.enterCommonName)
                        bdapAccountConfigNavMap.registerNavAction(RootActions.tokenCaptured, appRoutes.creatingBdapAccount)
                        bdapAccountConfigNavMap.registerNavAction(RootActions.resetOnboarding, appRoutes.enterUserName)
                        bdapAccountConfigNavMap.registerNavAction(RootActions.createBdapAccountComplete, appRoutes.passwordCreateOrLogin, true) //true parameter indicates stopping condition
                        //this will block until the navMap is complete
                        yield bdapAccountConfigNavMap.runNav();
                        if (returnedToCreateAccount) continue;
                        yield* waitForWalletCredentials();
                    } else {
                        yield put(pushRoute(appRoutes.restoreAccount))
    
    
                        for (; ;) {
                            let returnedToRestoreAccount = false
                            const { passphrase, mnemonicFile, cancelled } = yield race({
                                passphrase: take(getType(RootActions.restoreWithPassphrase)),
                                mnemonicFile: take(getType(RootActions.restoreWithMnemonicFile)),
                                cancelled: take(getType(RootActions.restoreCancelled))
                            })
    
                            if (cancelled) {
                                yield put(pushRoute(appRoutes.createAccount))
                                returnedToCreateAccount = true
                            }
                            else if (passphrase) {
                                yield put(pushRoute(appRoutes.restoreWithPassphrase))
                                const restoreNavMap = getNavMap();
                                restoreNavMap.registerNavAction(RootActions.restoreWithPassphrase, appRoutes.restoreWithPassphrase)
                                restoreNavMap.registerNavAction(RootActions.restoreWithPassphraseCancelled, appRoutes.restoreAccount, true, () => returnedToRestoreAccount = true)
                                restoreNavMap.registerNavAction(RootActions.restoreSync, appRoutes.restoreSyncProgress)
                                restoreNavMap.registerNavAction(RootActions.restoreFailed, appRoutes.restoreWithPassphrase)
                                restoreNavMap.registerNavAction(RootActions.restoreSuccess, appRoutes.passwordCreateOrLogin, true) //true parameter indicates stopping condition
    
                                yield restoreNavMap.runNav(); //note: this hangs until we hit a navAction with "stopOnThisAction" parameter `true`
                            }
                            else if (mnemonicFile) {
                                yield put(pushRoute(appRoutes.restoreWithMnemonicFile))
                                const restoreNavMap = getNavMap();
                                restoreNavMap.registerNavAction(RootActions.secureFilePassword, appRoutes.secureFilePassword)
                                restoreNavMap.registerNavAction(RootActions.restoreWithMnemonicFileCancelled, appRoutes.restoreAccount, true, () => returnedToRestoreAccount = true)
                                restoreNavMap.registerNavAction(RootActions.secureFilePasswordCancelled, appRoutes.restoreWithMnemonicFile)
                                restoreNavMap.registerNavAction(RootActions.restoreSync, appRoutes.restoreSyncProgress)
                                restoreNavMap.registerNavAction(RootActions.restoreFailed, appRoutes.restoreWithMnemonicFile)
                                restoreNavMap.registerNavAction(RootActions.restoreSuccess, appRoutes.passwordCreateOrLogin, true) //true parameter indicates stopping condition
    
                                yield restoreNavMap.runNav(); //note: this hangs until we hit a navAction with "stopOnThisAction" parameter `true`
                            }
    
    
                            if (returnedToRestoreAccount) continue;
                            if (returnedToCreateAccount) break
                            yield* waitForWalletCredentials();
                            break;
    
                        }
                    }
                    if (!returnedToCreateAccount) {
                        break;
                    }
                }
    
            }
            }
            


    }

    yield* dashboardNav()


}


// function* waitForUserDetails() {
//     const bdapAccountConfigNavMap = getNavMap();
//     //bdapAccountConfigNavMap.registerNavAction(RootActions.createAccount, appRoutes.enterUserName)
//     bdapAccountConfigNavMap.registerNavAction(RootActions.userNameCaptured, appRoutes.enterCommonName);
//     bdapAccountConfigNavMap.registerNavAction(RootActions.accountCreationCancelled, appRoutes.createAccount, true, () => returnedToCreateAccount = true)
//     bdapAccountConfigNavMap.registerNavAction(RootActions.commonNameCaptured, appRoutes.enterToken);
//     bdapAccountConfigNavMap.registerNavAction(RootActions.tokenCaptured, appRoutes.creatingBdapAccount);
//     bdapAccountConfigNavMap.registerNavAction(RootActions.resetOnboarding, appRoutes.enterUserName);
//     bdapAccountConfigNavMap.registerNavAction(RootActions.createBdapAccountComplete, appRoutes.passwordCreate, true); //true parameter indicates stopping condition
//     //this will block until the navMap is complete
//     yield bdapAccountConfigNavMap.runNav();
// }

function* dashboardNav() {
    const navMap = getNavMap()
    navMap.registerNavAction(DashboardActions.viewSharedFiles, dashboardRoutes.sharedFiles)
    navMap.registerNavAction(DashboardActions.viewMyLinks, dashboardRoutes.myLinks)
    navMap.registerNavAction(SharedFilesActions.close, dashboardRoutes.myLinks)
    navMap.registerNavAction(SharedFilesActions.shareNewFile, dashboardRoutes.addFile)
    navMap.registerNavAction(AddFileActions.close, dashboardRoutes.sharedFiles)
    navMap.registerNavAction(AppActions.shutdownAborted, dashboardRoutes.clientDownloads)
    yield navMap.runNav()
}

function* waitForWalletCredentials() {
    const isEncrypted: boolean = yield select((state: RendererRootState) => state.user.walletEncrypted);
    if (!isEncrypted) {
        const navMap = getNavMap();
        navMap.registerNavAction(RootActions.walletPasswordSetSuccess, appRoutes.mnemonicWarning);
        navMap.registerNavAction(RootActions.mnemonicWarningAccepted, appRoutes.mnemonicPage);
        navMap.registerNavAction(RootActions.mnemonicFileCreation, appRoutes.secureMnemonicFile);
        navMap.registerNavAction(RootActions.mnemonicFileSaveSuccess, appRoutes.mnemonicPage);
        navMap.registerNavAction(RootActions.mnemonicFilePasswordCancelled, appRoutes.mnemonicPage);
        navMap.registerNavAction(RootActions.mnemonicSecured, dashboardRoutes.myLinks, true);
        yield navMap.runNav();
    }
    else {
        const navMap = getNavMap();
        navMap.registerNavAction(RootActions.walletPasswordVerified, dashboardRoutes.myLinks, true);
        yield navMap.runNav();
    }
    console.log("dispatching BDAP_Actions.initialize")
    yield put(BdapActions.initialize());
}

function* waitForInitialized() {
    const appInitializedAction = getType(RootActions.appInitialized);
    yield take(appInitializedAction);
    console.log("nav saga init");
}

function* waitForSync() {
    const state: RendererRootState = yield select();
    if (!state.user.syncAgreed) {
        console.log("nav saga navigating to /SyncAgree");
        yield put(pushRoute(appRoutes.syncAgree));
        const userSyncAgreedAction = getType(RootActions.userAgreeSync);
        console.log("nav saga waiting for userSyncAgreedAction");
        yield take(userSyncAgreedAction);
        console.log("nav saga userSyncAgreedAction");
    }
    console.log("nav saga navigating to /Sync");
    yield put(pushRoute(appRoutes.sync));
    // const syncPageStartTime = performance.now();
    const syncCompleteAction = getType(RootActions.syncComplete);
    console.log("nav saga waiting for syncCompleteAction");
    yield take(syncCompleteAction);
}
