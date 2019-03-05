import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';
import { RootActions } from '../../shared/actions';
import { StoreActions } from '../../shared/actions/store';
import * as appModelReducers from '../../shared/reducers';
import { getInitialReducerState } from '../../shared/system/getInitialReducerState';



export type RtcRootState = ReturnType<ReturnType<typeof getRootReducer>>
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
