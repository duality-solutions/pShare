import { Middleware, Action, compose, createStore, applyMiddleware, Reducer, ActionCreator } from "redux";
import { getRendererRootReducer, RendererRootState, getMainRootReducer, MainRootState } from "../../reducers";
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


export function createRendererStoreWithHotReload(history: History<any>, middlewares: Middleware<Action<any>>[]) {
    const rootReducer = getRendererRootReducer(history);
    const reducer: Reducer<RendererRootState, RootActions> = compose(mergePersistedState())(rootReducer);
    //const storageAdapter = createReduxLocalStorageAdapter();
    const enhancers = composeEnhancers(applyMiddleware(...middlewares));
    const store = createStore(reducer, enhancers);
    if (module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            const newReducer = compose(mergePersistedState())(getRendererRootReducer(history));
            store.replaceReducer(newReducer);
            console.warn("reducers reloaded");
        });
    }
    window.resetStore = () => store.dispatch(StoreActions.reset())
    return store;
}
export function createMainStoreWithHotReload(middlewares: Middleware<Action<any>>[]) {
    const rootReducer = getMainRootReducer();
    const reducer: Reducer<MainRootState, RootActions> = compose(mergePersistedState())(rootReducer);
    //const storageAdapter = createReduxLocalStorageAdapter();
    const enhancers = composeEnhancers(applyMiddleware(...middlewares));
    const store = createStore(reducer, enhancers);
    if (module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            const newReducer = compose(mergePersistedState())(getMainRootReducer());
            store.replaceReducer(newReducer);
            console.warn("reducers reloaded");
        });
    }
    //window.resetStore = () => store.dispatch(StoreActions.reset())
    return store;
}