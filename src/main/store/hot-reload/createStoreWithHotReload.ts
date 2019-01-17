import { Middleware, Action, createStore, compose, applyMiddleware, ActionCreator, Reducer } from "redux";
import { getRootReducer, MainRootState } from "../../reducers";
import StoreActions from '../../../shared/actions/store'
import createReduxLocalStorageAdapter from '../../../shared/system/createReduxLocalStorageAdapter'
import persistState, { mergePersistedState } from 'redux-localstorage';
import RootActions from "../../../shared/actions";
import filter from 'redux-localstorage-filter';

declare global {
    interface Window {
        resetStore: ActionCreator<StoreActions>
    }
}



export function createStoreWithHotReload(middlewares: Middleware<Action<any>>[], persistencePaths: string[] | undefined = undefined) {
    const storageAdapter = createReduxLocalStorageAdapter();
    const storage = persistencePaths ? compose(filter(persistencePaths))(storageAdapter) : storageAdapter;
    const reducer: Reducer<MainRootState, RootActions> = getPersistingReducer();
    const enhancers = compose(applyMiddleware(...middlewares), persistState(storage))
    const store = createStore(reducer, enhancers);
    if (!process.env.NODE_ENV && module.hot) {
        module.hot.accept("../../reducers", () => {
            console.info("hot-reloading reducers");
            const reducer: Reducer<MainRootState, RootActions> = getPersistingReducer();
            store.replaceReducer(reducer);
            console.warn("reducers reloaded");
        });
    }
    return store;
}

function getPersistingReducer() {
    const rootReducer = getRootReducer();
    const reducer: Reducer<MainRootState, RootActions> = compose(mergePersistedState())(rootReducer);
    return reducer;
}
