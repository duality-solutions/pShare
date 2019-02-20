import { createEpicMiddleware } from 'redux-observable'
import createSagaMiddleware from 'redux-saga'
import { createStoreWithHotReload } from './hot-reload/createStoreWithHotReload';
import { runRootSagaWithHotReload } from './hot-reload/runRootSagaWithHotReload';
import {
    forwardToRenderer,
    triggerAlias,
    replayActionMain,
} from 'electron-redux';
import { BrowserWindowProvider } from '../../shared/system/BrowserWindowProvider';

// import runEpicWithHotReload from './hot-reload/runEpicWithHotReload';
export function configureStore(browserWindowProvider: BrowserWindowProvider, persistencePaths: string[] | undefined = undefined) {

    const epicMiddleware = createEpicMiddleware()
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [triggerAlias, epicMiddleware, sagaMiddleware, forwardToRenderer];
    const store = createStoreWithHotReload(middlewares, persistencePaths);
    //runEpicWithHotReload(epicMiddleware);
    runRootSagaWithHotReload(sagaMiddleware, browserWindowProvider);
    replayActionMain(store);
    return store;
}
