import { AppActions } from '../actions/app';
import { getType } from 'typesafe-actions';
export const app = (state: AppState = { hasShutdown: false }, action: AppActions): AppState => {
    switch (action.type) {
        case getType(AppActions.terminated):
            return { ...state, hasShutdown: true }
        default:
            return state
    }
};
export interface AppState {
    hasShutdown: boolean;
}
