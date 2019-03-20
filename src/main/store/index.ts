import createSagaMiddleware from 'redux-saga'
import { createStoreWithHotReload } from './hot-reload/createStoreWithHotReload';
import { runRootSagaWithHotReload } from './hot-reload/runRootSagaWithHotReload';
import {
    forwardToRenderer,
    triggerAlias,
    replayActionMain,
} from 'electron-redux';
import { BrowserWindowProvider } from '../../shared/system/BrowserWindowProvider';

export function configureStore(browserWindowProvider: BrowserWindowProvider, persistencePaths: string[] | undefined = undefined) {

    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [triggerAlias, sagaMiddleware, forwardToRenderer];
    const store = createStoreWithHotReload(middlewares, persistencePaths);
    runRootSagaWithHotReload(sagaMiddleware, browserWindowProvider);
    replayActionMain(store);
    return store;
}
