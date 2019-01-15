import { createEpicMiddleware } from 'redux-observable'
import createSagaMiddleware from 'redux-saga'
import { createStoreWithHotReload } from './hot-reload/createStoreWithHotReload';
import runRootSagaWithHotReload from './hot-reload/runRootSagaWithHotReload';
import {
    forwardToRenderer,
    triggerAlias,
    replayActionMain,
} from 'electron-redux';
// import runEpicWithHotReload from './hot-reload/runEpicWithHotReload';
export function configureStore() {

    const epicMiddleware = createEpicMiddleware()
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [triggerAlias, epicMiddleware, sagaMiddleware, forwardToRenderer];
    const store = createStoreWithHotReload(middlewares);
    //runEpicWithHotReload(epicMiddleware);
    runRootSagaWithHotReload(sagaMiddleware);
    replayActionMain(store);
    return store;
}
