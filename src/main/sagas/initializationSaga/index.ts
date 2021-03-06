import { take, call, put, select, all } from "redux-saga/effects";
import { RpcClientWrapper } from "../../RpcClient";
import { RootActions } from "../../../shared/actions";
import { getType } from 'typesafe-actions';
import { MainRootState } from "../../reducers";
import { delay } from "../../../shared/system/delay";
import { round } from "../../../shared/system/round";
import { SyncState } from "../../../dynamicdInterfaces/SyncState";
import { getWalletIsEncrypted } from "../effects/getWalletIsEncrypted";
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { RtcActions } from "../../../shared/actions/rtc";

const round0 = round(0)



export function* initializationSaga(rpcClientProvider: () => Promise<RpcClientWrapper>) {
    console.log("starting initialization saga")
    // synchronize renderer state with our state
    yield put(RootActions.hydratePersistedData())
    //...and wait for complete initialization
    yield all({
        appInitialized: take(getType(RootActions.appInitialized)),
        rtcStoreReady: take(getType(RtcActions.rtcStoreReady))
    })
    // grab the current application state
    const state: MainRootState = yield select();
    // this property will eventually be persisted
    if (!state.user.syncAgreed) {
        // announce we're waiting for user to agree to sync
        // this will be picked up by the navSaga attached to the
        // renderer store, navigating UI to correct page
        yield put(RootActions.waitingForUserSyncAgreement());
        const userSyncAgreedAction = getType(RootActions.userAgreeSync)
        // wait for the user to agree (posted from the renderer)
        yield take(userSyncAgreedAction)
    }
    // announce we're waiting for dnsync
    // this will be picked up by the navSaga attached to the
    // renderer store, navigating UI to correct page
    yield put(RootActions.waitingForSync());
    // call getBitcoinClient... it's an async function (returns a Promise) so 
    // in a saga, we await for it as follows
    const client: RpcClientWrapper = yield call(() => rpcClientProvider());
    console.log("got rpcClient")
    let currentCompletionPercent: number = -1000;
    for (; ;) {
        let syncState: SyncState;
        try {
            // fetch the state from dynamicd
            syncState = yield call(() => client.command({ timeout: 5000 }, "syncstatus"));
        }
        catch (e) {
            // oh no, something bad
            console.log("an error occurred when querying syncstatus", e);
            // wait 5s
            yield call(delay, 5000);
            // try again
            continue;
        }

        // sync_progress progress indicates our progress from 0.0 to 1.0
        // Multiply by 100 and round off to 0 decimal places
        const currentVerificationProgress = round0(syncState.sync_progress * 100)
        const completionPercent: number = currentVerificationProgress;
        if (completionPercent !== currentCompletionPercent) {
            currentCompletionPercent = completionPercent
            yield put(RootActions.syncProgress({ completionPercent }));
        }
        // dispatch a "sync/PROGRESS" action



        // if we've hit 100%, we're done
        if (currentCompletionPercent === 100 && syncState.fully_synced) {
            // complete
            break;
        }

        //wait, then go again
        yield call(delay, 1000);
    }
    // let the user reducer know if the wallet is encrypted
    const isEncrypted = yield getWalletIsEncrypted(client)
    yield put(OnboardingActions.walletIsEncrypted(isEncrypted))

    yield put(RootActions.syncComplete());

    return client

}


