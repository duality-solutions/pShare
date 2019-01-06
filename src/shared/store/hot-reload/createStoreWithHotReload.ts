import { Middleware, Action, compose, createStore, applyMiddleware, Reducer, ActionCreator } from "redux";
import { getRootReducer, RootState } from "../../reducers";
import { composeEnhancers } from "../../system/reduxDevToolsCompose";
import createReduxLocalStorageAdapter from "../../system/createReduxLocalStorageAdapter";
import { History } from "history";
import persistState, { mergePersistedState } from 'redux-localstorage';
import StoreActions from '../../actions/store'
import RootActions from "../../actions";

declare global {
    interface Window {
        resetStore:ActionCreator<StoreActions>
    }
}


export default function createStoreWithHotReload(history: History<any>, middlewares: Middleware<Action<any>>[]) {
    const rootReducer = getRootReducer(history);
    const reducer: Reducer<RootState, RootActions> = compose(mergePersistedState())(rootReducer);
    const storageAdapter = createReduxLocalStorageAdapter();
    const enhancers = composeEnhancers(applyMiddleware(...middlewares), persistState(storageAdapter));
    const store = createStore(reducer, enhancers);
    if (module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            const newReducer = compose(mergePersistedState())(getRootReducer(history));
            store.replaceReducer(newReducer);
            console.warn("reducers reloaded");
        });
    }
    window.resetStore = () => store.dispatch(StoreActions.reset())
    return store;
}