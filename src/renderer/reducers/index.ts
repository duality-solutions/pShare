import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import { History } from 'history';
import { getType } from 'typesafe-actions';
import StoreActions from '../../shared/actions/store';
import RootActions from '../../shared/actions';
import getInitialReducerState from '../../shared/system/getInitialReducerState';

import * as appModelReducers from '../../shared/reducers'


export type RendererRootState = ReturnType<ReturnType<typeof getRootReducer>>
export const getRootReducer = (history: History) => {
    const r = combineReducers({ ...appModelReducers, router: connectRouter(history) });
    return (state: ReturnType<typeof r> | undefined, action: RootActions): ReturnType<typeof r> => {
        switch (action.type) {
            case getType(StoreActions.reset):
                return getInitialReducerState(r);
            default:
                return r(state, action);
        }
    }
}
