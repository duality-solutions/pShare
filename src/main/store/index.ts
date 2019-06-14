import createSagaMiddleware from 'redux-saga'
import { createStoreWithHotReload } from './hot-reload/createStoreWithHotReload';
import { runRootSagaWithHotReload } from './hot-reload/runRootSagaWithHotReload';
import {
    forwardToRenderer,
    triggerAlias,
    replayActionMain,
} from 'electron-redux';
import { BrowserWindowProvider } from '../../shared/system/BrowserWindowProvider';
import { createEventEmitter } from '../../shared/system/events/createEventEmitter';
import { AppActions } from '../../shared/actions/app';
import { prepareErrorForSerialization } from '../../shared/proxy/prepareErrorForSerialization';

export function configureStore(browserWindowProvider: BrowserWindowProvider, persistencePaths: string[] | undefined = undefined) {

    const eventEmitter = createEventEmitter()
    const sagaMiddleware = createSagaMiddleware({ onError: (error: Error) => eventEmitter.dispatchEvent("error", error) });
    const middlewares = [triggerAlias, sagaMiddleware, forwardToRenderer];
    const store = createStoreWithHotReload(middlewares, persistencePaths);
    eventEmitter.addEventListener("error", err => store.dispatch(AppActions.sagaError(prepareErrorForSerialization(err))))
    runRootSagaWithHotReload(sagaMiddleware, browserWindowProvider, eventEmitter, store);
    replayActionMain(store);
    return store;
}
