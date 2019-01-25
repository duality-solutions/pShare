import { Middleware, Action, createStore, applyMiddleware, ActionCreator, Reducer, compose } from "redux";
import { getRootReducer, RendererRootState } from "../../reducers";
import { composeEnhancers } from "../../system/reduxDevToolsCompose";
import { History } from "history";
import StoreActions from '../../../shared/actions/store'
import RootActions from "../../../shared/actions";
import { mergePersistedState } from 'redux-localstorage';
import { deepMerge } from "../../../shared/system/deepMerge";

declare global {
    interface Window {
        resetStore: ActionCreator<StoreActions>
    }
}


export function createStoreWithHotReload(history: History<any>, middlewares: Middleware<Action<any>>[]) {
    const rootReducer = getPersistingReducer(history);
    const enhancers = composeEnhancers(applyMiddleware(...middlewares));
    const store = createStore(rootReducer, enhancers);

    const isDevelopment = process.env.NODE_ENV === 'development'
    if (isDevelopment && module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            store.replaceReducer(getPersistingReducer(history));
            console.warn("reducers reloaded");
        });
    }
    window.resetStore = () => store.dispatch(StoreActions.reset())
    return store;
}

function getPersistingReducer(history: History<any>) {
    const rootReducer = getRootReducer(history);
    const reducer: Reducer<RendererRootState, RootActions> = compose(mergePersistedState(deepMerge))(rootReducer);
    return reducer;
}