import { Middleware, Action,  createStore, applyMiddleware, ActionCreator } from "redux";
import { getRootReducer } from "../../reducers";
import StoreActions from '../../../shared/actions/store'

declare global {
    interface Window {
        resetStore:ActionCreator<StoreActions>
    }
}



export function createStoreWithHotReload(middlewares: Middleware<Action<any>>[]) {
    const rootReducer = getRootReducer();
    const enhancers = applyMiddleware(...middlewares);
    const store = createStore(rootReducer, enhancers);
    if (!process.env.NODE_ENV && module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            store.replaceReducer(getRootReducer());
            console.warn("reducers reloaded");
        });
    }
    return store;
}