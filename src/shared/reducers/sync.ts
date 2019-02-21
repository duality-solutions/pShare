import { SyncActions } from '../actions/sync'
import { getType } from 'typesafe-actions';
import { AppActions } from '../actions/app';
import { RootActions } from '../actions';

interface SyncState {
    progressPercent: number,
    isComplete: boolean,
    syncStarted: boolean
}

export const sync = (state: SyncState = { progressPercent: 0, isComplete: false, syncStarted: false }, action: RootActions): SyncState => {
    switch (action.type) {
        case getType(SyncActions.syncProgress):
            return { ...state, progressPercent: action.payload.completionPercent, syncStarted: true }
        case getType(SyncActions.syncComplete):
            return { ...state, isComplete: true }
        case getType(AppActions.initializeApp):
            return { ...state, isComplete: false, syncStarted: false, progressPercent: 0 }
        default:
            return state;

    }
} 