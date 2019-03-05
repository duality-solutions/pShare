import { Middleware, Action, createStore, applyMiddleware, ActionCreator, Reducer, compose } from "redux";
import { getRootReducer, RtcRootState } from "../../reducers";
import { StoreActions } from '../../../shared/actions/store'
import { RootActions } from "../../../shared/actions";
import { mergePersistedState } from 'redux-localstorage';
import { deepMerge } from "../../../shared/system/deepMerge";

declare global {
    interface Window {
        resetStore: ActionCreator<StoreActions>
    }
}


export function createStoreWithHotReload(middlewares: Middleware<Action<any>>[]) {
    const rootReducer = getPersistingReducer();
    const enhancers = compose(applyMiddleware(...middlewares));
    const store = createStore(rootReducer, enhancers);

    const isDevelopment = process.env.NODE_ENV === 'development'
    if (isDevelopment && module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            store.replaceReducer(getPersistingReducer());
            console.warn("reducers reloaded");
        });
    }
    window.resetStore = () => store.dispatch(StoreActions.reset())
    return store;
}

function getPersistingReducer() {
    const rootReducer = getRootReducer();
    const reducer: Reducer<RtcRootState, RootActions> = compose(mergePersistedState(deepMerge))(rootReducer);
    return reducer;
}