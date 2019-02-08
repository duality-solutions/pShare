import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { StoreActions } from '../../shared/actions/store';
import { RootActions } from '../../shared/actions';
import { getInitialReducerState } from '../../shared/system/getInitialReducerState';
import * as appModelReducers from '../../shared/reducers'

export type MainRootState = ReturnType<ReturnType<typeof getRootReducer>>
export const getRootReducer = () => {
    const r = combineReducers({ ...appModelReducers });
    return (state: ReturnType<typeof r> | undefined, action: RootActions): ReturnType<typeof r> => {
        switch (action.type) {
            case getType(StoreActions.reset):
                return getInitialReducerState(r);
            default:
                return r(state, action);
        }
    }
}
