import createSagaMiddleware from 'redux-saga'
import { createStoreWithHotReload } from './hot-reload/createStoreWithHotReload';
import { runRootSagaWithHotReload } from './hot-reload/runRootSagaWithHotReload';
import {
    forwardToRenderer,
    triggerAlias,
    replayActionMain,
} from 'electron-redux';
import { BrowserWindowProvider } from '../../shared/system/BrowserWindowProvider';
import { CancellationToken } from '../../shared/system/createCancellationToken';

export function configureStore(browserWindowProvider: BrowserWindowProvider, persistencePaths: string[] | undefined = undefined, cancellationToken: CancellationToken) {

    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [triggerAlias, sagaMiddleware, forwardToRenderer];
    const store = createStoreWithHotReload(middlewares, persistencePaths);
    runRootSagaWithHotReload(sagaMiddleware, browserWindowProvider, cancellationToken);
    replayActionMain(store);
    return store;
}
