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
        if (typeof currentState.user.userName !== 'undefined') {
            yield put(pushRoute(appRoutes.passwordCreate))
            yield* waitForWalletCredentials();
        }
        else {
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
                    bdapAccountConfigNavMap.registerNavAction(RootActions.createBdapAccountComplete, appRoutes.passwordCreate, true) //true parameter indicates stopping condition
                    //this will block until the navMap is complete
                    yield bdapAccountConfigNavMap.runNav();
                    if( returnedToCreateAccount ) continue;
                    yield* waitForWalletCredentials();
                } else {
                    yield put(pushRoute(appRoutes.restoreAccount))

                    const restoreNavMap = getNavMap();
                    //note that the last parameter (onNavigate) can be optionally supplied, and is called when that particular navAction happens
                    //here, we're using this so that we can tell if the user has completely backed out of restore, in which case, we want to 
                    //restart the loop that we're in
                    restoreNavMap.registerNavAction(RootActions.restoreCancelled, appRoutes.createAccount, true, () => returnedToCreateAccount = true)
                    restoreNavMap.registerNavAction(RootActions.restoreWithPassphrase, appRoutes.restoreWithPassphrase)
                    restoreNavMap.registerNavAction(RootActions.restoreWithMnemonicFile, appRoutes.restoreWithMnemonicFile)
                    restoreNavMap.registerNavAction(RootActions.secureFilePassword, appRoutes.secureFilePassword)
                    restoreNavMap.registerNavAction(RootActions.restoreWithPassphraseCancelled, appRoutes.restoreAccount)
                    restoreNavMap.registerNavAction(RootActions.restoreWithMnemonicFileCancelled, appRoutes.restoreAccount)
                    restoreNavMap.registerNavAction(RootActions.secureFilePasswordCancelled, appRoutes.restoreWithMnemonicFile)
                    restoreNavMap.registerNavAction(RootActions.restoreSync, appRoutes.restoreSyncProgress, true)
                    yield restoreNavMap.runNav(); //note: this hangs until we hit a navAction with "stopOnThisAction" parameter `true`
                }
                if (!returnedToCreateAccount) {
                    break;
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

function* dashboardNav(){
    const navMap=getNavMap()
    navMap.registerNavAction(DashboardActions.viewSharedFiles, dashboardRoutes.sharedFiles)
    navMap.registerNavAction(DashboardActions.viewMyLinks, dashboardRoutes.myLinks)
    navMap.registerNavAction(SharedFilesActions.close, dashboardRoutes.myLinks)
    navMap.registerNavAction(SharedFilesActions.shareNewFile, dashboardRoutes.addFile)
    navMap.registerNavAction(AddFileActions.close, dashboardRoutes.sharedFiles)
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
        navMap.registerNavAction(RootActions.walletPasswordSetSuccess, dashboardRoutes.myLinks, true);
        yield navMap.runNav();
    }
    console.log("dispatching BdapActions.initialize")
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
