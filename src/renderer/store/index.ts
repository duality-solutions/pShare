import { History } from 'history'
import createSagaMiddleware from 'redux-saga'
import createRouterMiddleware from './router-middleware/createRouterMiddleware';
import { createStoreWithHotReload } from './hot-reload/createStoreWithHotReload';
import runRootSagaWithHotReload from './hot-reload/runRootSagaWithHotReload';
import {
    forwardToMain,
    replayActionRenderer,
} from 'electron-redux';
export function configureStore(history: History) {

    if (history === null) {
        throw Error("history must be supplied for renderer store")
    }
    const sagaMiddleware = createSagaMiddleware();
    const routerMiddleware = createRouterMiddleware(history);
    const middlewares = [forwardToMain, sagaMiddleware, routerMiddleware];
    const store = createStoreWithHotReload(history, middlewares);
    runRootSagaWithHotReload(sagaMiddleware)
    replayActionRenderer(store);
    return store
}
