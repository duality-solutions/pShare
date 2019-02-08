import { SyncActions } from '../actions/sync'
import { getType } from 'typesafe-actions';

interface SyncState {
    progressPercent: number,
    isComplete: boolean,
    syncStarted: boolean
}

export const sync = (state: SyncState = { progressPercent: 0, isComplete: false, syncStarted: false }, action: SyncActions): SyncState => {
    switch (action.type) {
        case getType(SyncActions.syncProgress):
            return { ...state, progressPercent: action.payload.completionPercent, syncStarted: true }
        case getType(SyncActions.syncComplete):
            return { ...state, isComplete: true }
        default:
            return state;

    }
} 