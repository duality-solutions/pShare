import { put, select, take, race } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { RootActions } from "../../../shared/actions";
import { RendererRootState } from "../../reducers";
import { appRoutes, pushRoute, dashboardRoutes } from "../../routes/appRoutes";
import { getNavMap } from "./getNavMap";
import { BdapActions } from "../../../shared/actions/bdap";

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

            const { createAccount } = yield race({
                createAccount: take(getType(RootActions.createAccount)),
                restoreAccount: take(getType(RootActions.restoreAccount))
            })

            if (createAccount) {
                yield put(pushRoute(appRoutes.enterUserName))
                yield* waitForUserDetails();
                yield* waitForWalletCredentials();

            } else {
                yield put(pushRoute(appRoutes.restoreAccount))
                const restoreNavMap = getNavMap();
                const { restoreWithPassphrase } = yield race({
                    restoreWithPassphrase: take(getType(RootActions.restoreWithPassphrase)),
                    restoreWithMnemonicFile: take(getType(RootActions.restoreWithMnemonicFile))
                })
                if ( restoreWithPassphrase ) {
                    yield put(pushRoute(appRoutes.restoreWithPassphrase))
                } else {
                    yield put(pushRoute(appRoutes.restoreWithMnemonicFile))
                    restoreNavMap.registerNavAction(RootActions.secureFilePassword, appRoutes.secureFilePassword)
                }
                restoreNavMap.registerNavAction(RootActions.restoreSync, appRoutes.restoreSyncProgress, true)
                yield restoreNavMap.runNav();
            }
        }


    }


}


function* waitForUserDetails() {
    const bdapAccountConfigNavMap = getNavMap();
    //bdapAccountConfigNavMap.registerNavAction(RootActions.createAccount, appRoutes.enterUserName)
    bdapAccountConfigNavMap.registerNavAction(RootActions.userNameCaptured, appRoutes.enterCommonName);
    bdapAccountConfigNavMap.registerNavAction(RootActions.commonNameCaptured, appRoutes.enterToken);
    bdapAccountConfigNavMap.registerNavAction(RootActions.tokenCaptured, appRoutes.creatingBdapAccount);
    bdapAccountConfigNavMap.registerNavAction(RootActions.resetOnboarding, appRoutes.enterUserName);
    bdapAccountConfigNavMap.registerNavAction(RootActions.createBdapAccountComplete, appRoutes.passwordCreate, true); //true parameter indicates stopping condition
    //this will block until the navMap is complete
    yield bdapAccountConfigNavMap.runNav();
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
