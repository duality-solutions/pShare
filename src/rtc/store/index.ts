import createSagaMiddleware from 'redux-saga'
import { createStoreWithHotReload } from './hot-reload/createStoreWithHotReload';
import { runRootSagaWithHotReload } from './hot-reload/runRootSagaWithHotReload';
import {
    forwardToMain,
    replayActionRenderer,
} from 'electron-redux';
export function configureStore() {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [forwardToMain, sagaMiddleware];
    const store = createStoreWithHotReload( middlewares);
    runRootSagaWithHotReload(sagaMiddleware)
    replayActionRenderer(store);
    return store
}
