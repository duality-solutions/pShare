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
    yield take(initializeAppAction);
    const state: MainRootState = yield select();
    if (!state.user.syncAgreed) {
        yield put(RootActions.waitingForUserSyncAgreement());
        const userSyncAgreedAction = getType(RootActions.userAgreeSync)
        yield take(userSyncAgreedAction)
    }
    yield put(RootActions.waitingForSync());
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
        const currentStageIndex = getStageIndex(syncState, expectedMonitoringStates);
        if (currentStageIndex !== stageIndex) {
            const completionPercent: number = 100 * currentStageIndex / maximumStageIndex;
            yield put(RootActions.syncProgress({ completionPercent }));
            stageIndex = currentStageIndex;
            // if we've hit the final stage
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
