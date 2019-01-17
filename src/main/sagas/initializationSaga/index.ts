import { take, call, put, select } from "redux-saga/effects";
import { getBitcoinClient } from "../../../main/getBitcoinClient";
import BitcoinClient from 'bitcoin-core';
import RootActions from "../../../shared/actions";
import { getType } from 'typesafe-actions';
import { DynodeSyncState } from "./DynodeSyncState";
import { ExpectedMonitoringState } from "./ExpectedMonitoringState";
import { getExpectedMonitoringStates } from "./getExpectedMonitoringStates";
import { MainRootState } from "../../reducers";

const delay = (time: number) => new Promise(r => setTimeout(r, time));
const expectedMonitoringStates = getExpectedMonitoringStates()
const maximumStageIndex = Math.max(...expectedMonitoringStates.map(ms => ms.stageIndex));
// 1 level deep object comparison
// compares each property in `stateToMatch` for equality against the matching property in `currentState`
// and if all comparisons are `true`, returns `true`.
// `currentState` may contain more properties than `stateToMatch`. These will be ignored
const isMatch = (currentState: any, stateToMatch: any) => Object.keys(stateToMatch)
    .reduce((isMatch, propName) => isMatch && currentState[propName] === stateToMatch[propName], true);
// matches `currentState` to one of the items in `expectedMonitoringStates` and return a `stageIndex`
function getStageIndex(currentState: DynodeSyncState, expectedMonitoringStates: ExpectedMonitoringState[]) {
    const candidateStates = expectedMonitoringStates.filter(expectedMonitoringState => isMatch(currentState, expectedMonitoringState.state));
    if (candidateStates.length > 1) {
        throw Error("unexpectedly matched more than one state");
    }
    if (candidateStates.length === 0) {
        console.log("stateMismatch : ", currentState);
        throw Error("currentState did not match an expected state");
    }
    const [matchedState] = candidateStates;
    return matchedState.stageIndex;
}


export function* initializationSaga() {
    const initializeAppAction = getType(RootActions.initializeApp);
    // wait for "app/INITIALIZE"
    yield take(initializeAppAction);
    // synchronize renderer state with our state
    yield put(RootActions.hydratePersistedData())
    //...and wait for complete initialization
    yield take(getType(RootActions.appInitialized))
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
    const client: BitcoinClient = yield call(getBitcoinClient);
    let stageIndex: number = -1000;
    for (; ;) {
        let syncState: DynodeSyncState;
        try {
            // fetch the state from dynamicd
            syncState = yield call(() => client.command("dnsync", "status"));
        }
        catch (e) {
            // oh no, something bad
            console.log("an error occurred when querying dnsync status", e);
            // wait 5s
            yield call(delay, 5000);
            // try again
            continue;
        }
        // currentStageIndex indicates how far we've progressed
        const currentStageIndex = getStageIndex(syncState, expectedMonitoringStates);
        // if anything has changed, we need to dispatch an action, announcing
        // the change
        if (currentStageIndex !== stageIndex) {
            // we can use currentStageIndex to calculate a percentatge
            const completionPercent: number = 100 * currentStageIndex / maximumStageIndex;
            // dispatch a "sync/PROGRESS" action
            yield put(RootActions.syncProgress({ completionPercent }));
            stageIndex = currentStageIndex;
            // if we've hit the final stage, we're done
            if (stageIndex === maximumStageIndex) {
                // complete
                yield put(RootActions.syncComplete());
                break;
            }
        }
        //wait, then go again
        yield call(delay, 1000);
    }
}
