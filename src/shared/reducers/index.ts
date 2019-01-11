import counter from './counter'
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import { History } from 'history';
import { getType } from 'typesafe-actions';
import StoreActions from '../actions/store';
import RootActions from '../actions';
import getInitialReducerState from '../system/getInitialReducerState';


export type MainRootState = ReturnType<ReturnType<typeof getMainRootReducer>>
export const getMainRootReducer = () => {
    const r = combineReducers({ counter });
    return (state: ReturnType<typeof r> | undefined, action: RootActions): ReturnType<typeof r> => {
        switch (action.type) {
            case getType(StoreActions.reset):
                return getInitialReducerState(r);
            default:
                return r(state, action);
        }
    }
}
export type RendererRootState = ReturnType<ReturnType<typeof getRendererRootReducer>>
export const getRendererRootReducer = (history: History) => {
    const r = combineReducers({ counter, router: connectRouter(history) });
    return (state: ReturnType<typeof r> | undefined, action: RootActions): ReturnType<typeof r> => {
        switch (action.type) {
            case getType(StoreActions.reset):
                return getInitialReducerState(r);
            default:
                return r(state, action);
        }
    }
}
