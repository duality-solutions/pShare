import AppActions from '../actions/app'
import { getType } from 'typesafe-actions';

interface SyncState {
    progressPercent: number,
    isComplete: boolean,
    syncStarted: boolean
}

export default (state: SyncState = { progressPercent: 0, isComplete: false, syncStarted: false }, action: AppActions): SyncState => {
    switch (action.type) {
        case getType(AppActions.syncProgress):
            return { ...state, progressPercent: action.payload.completionPercent, syncStarted: true }
        case getType(AppActions.syncComplete):
            return { ...state, isComplete: true }
        default:
            return state;

    }
} 