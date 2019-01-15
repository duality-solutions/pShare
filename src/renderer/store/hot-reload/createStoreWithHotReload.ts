import { Middleware, Action,  createStore, applyMiddleware, ActionCreator } from "redux";
import { getRootReducer } from "../../reducers";
import { composeEnhancers } from "../../system/reduxDevToolsCompose";
import { History } from "history";
import StoreActions from '../../../shared/actions/store'

declare global {
    interface Window {
        resetStore:ActionCreator<StoreActions>
    }
}


export function createStoreWithHotReload(history: History<any>, middlewares: Middleware<Action<any>>[]) {
    const rootReducer = getRootReducer(history);
    const enhancers = composeEnhancers(applyMiddleware(...middlewares));
    const store = createStore(rootReducer, enhancers);
    if (!process.env.NODE_ENV && module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            store.replaceReducer(getRootReducer(history));
            console.warn("reducers reloaded");
        });
    }
    window.resetStore = () => store.dispatch(StoreActions.reset())
    return store;
}
