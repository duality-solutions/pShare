import { Middleware, Action,  createStore, applyMiddleware, ActionCreator } from "redux";
import { getRendererRootReducer,  getMainRootReducer } from "../../reducers";
import { composeEnhancers } from "../../system/reduxDevToolsCompose";
import { History } from "history";
import StoreActions from '../../actions/store'

declare global {
    interface Window {
        resetStore:ActionCreator<StoreActions>
    }
}


export function createRendererStoreWithHotReload(history: History<any>, middlewares: Middleware<Action<any>>[]) {
    const rootReducer = getRendererRootReducer(history);
    const enhancers = composeEnhancers(applyMiddleware(...middlewares));
    const store = createStore(rootReducer, enhancers);
    if (!process.env.NODE_ENV && module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            store.replaceReducer(getRendererRootReducer(history));
            console.warn("reducers reloaded");
        });
    }
    window.resetStore = () => store.dispatch(StoreActions.reset())
    return store;
}
export function createMainStoreWithHotReload(middlewares: Middleware<Action<any>>[]) {
    const rootReducer = getMainRootReducer();
    const enhancers = applyMiddleware(...middlewares);
    const store = createStore(rootReducer, enhancers);
    if (!process.env.NODE_ENV && module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            store.replaceReducer(getMainRootReducer());
            console.warn("reducers reloaded");
        });
    }
    return store;
}