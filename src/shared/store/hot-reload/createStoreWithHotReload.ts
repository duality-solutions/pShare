import { Middleware, Action,  createStore, applyMiddleware, ActionCreator } from "redux";
import { getRendererRootReducer,  getMainRootReducer } from "../../reducers";
import { composeEnhancers } from "../../system/reduxDevToolsCompose";
//import createReduxLocalStorageAdapter from "../../system/createReduxLocalStorageAdapter";
import { History } from "history";
//import persistState, { mergePersistedState } from 'redux-localstorage';
import StoreActions from '../../actions/store'
//import getInitialReducerState from "../../../shared/system/getInitialReducerState";
//import RootActions from "../../actions";

declare global {
    interface Window {
        resetStore:ActionCreator<StoreActions>
    }
}


export function createRendererStoreWithHotReload(history: History<any>, middlewares: Middleware<Action<any>>[]) {
    const rootReducer = getRendererRootReducer(history);
    //if(rootReducer===undefined)throw Error();
    //const r: Reducer<RendererRootState, RootActions> =rootReducer
    //const reducer: Reducer<RendererRootState, RootActions> = compose(mergePersistedState())(rootReducer);
    //const storageAdapter = createReduxLocalStorageAdapter();
    const enhancers = composeEnhancers(applyMiddleware(...middlewares));
    const store = createStore(rootReducer, enhancers);
    if (!process.env.NODE_ENV && module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            //const newReducer = compose(mergePersistedState())(getRendererRootReducer(history));
            store.replaceReducer(getRendererRootReducer(history));
            console.warn("reducers reloaded");
        });
    }
    window.resetStore = () => store.dispatch(StoreActions.reset())
    return store;
}
export function createMainStoreWithHotReload(middlewares: Middleware<Action<any>>[]) {
    const rootReducer = getMainRootReducer();
    //const reducer: Reducer<MainRootState, RootActions> = compose(mergePersistedState())(rootReducer);
    //const storageAdapter = createReduxLocalStorageAdapter();
    const enhancers = applyMiddleware(...middlewares);
    const store = createStore(rootReducer, enhancers);
    if (!process.env.NODE_ENV && module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            //const newReducer = compose(mergePersistedState())(getMainRootReducer());
            store.replaceReducer(getMainRootReducer());
            console.warn("reducers reloaded");
        });
    }
    //window.resetStore = () => store.dispatch(StoreActions.reset())
    return store;
}