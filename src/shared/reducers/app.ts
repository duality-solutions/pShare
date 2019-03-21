import { getType } from 'typesafe-actions';
import { AppActions } from '../actions/app';


interface AppState {
    rpcClientFailure: boolean;
    rpcClientFailureReason?: string
}

export const app = (state: AppState = { rpcClientFailure: false }, action: AppActions): AppState => {
    switch (action.type) {
        case getType(AppActions.getRpcClientUnsuccessful):
            return { ...state, rpcClientFailure: true, rpcClientFailureReason: action.payload || "unknown" };
        default:
            return state;
    }
};

