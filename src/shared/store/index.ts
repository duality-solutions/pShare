import { History } from 'history'
import { createEpicMiddleware } from 'redux-observable'
import createSagaMiddleware from 'redux-saga'
import createRouterMiddleware from '../system/createRouterMiddleware';
import { createRendererStoreWithHotReload, createMainStoreWithHotReload } from './hot-reload/createStoreWithHotReload';
import runMainRootSagaWithHotReload from './hot-reload/runMainRootSagaWithHotReload';
import {
    forwardToMain,
    forwardToRenderer,
    triggerAlias,
    replayActionMain,
    replayActionRenderer,
} from 'electron-redux';
import { StoreScope } from './StoreScope';
import runRootEpicWithHotReload from './hot-reload/runRootEpicWithHotReload';
import runRendererRootSagaWithHotReload from './hot-reload/runRendererRootSagaWithHotReload';
export function configureStore(scope: StoreScope, history: History | null = null) {

    if (scope === "main") {
        const epicMiddleware = createEpicMiddleware()
        const sagaMiddleware = createSagaMiddleware();
        const middlewares = [triggerAlias, epicMiddleware, sagaMiddleware, forwardToRenderer];
        const store = createMainStoreWithHotReload(middlewares);
        runRootEpicWithHotReload(epicMiddleware);
        runMainRootSagaWithHotReload(sagaMiddleware, store);
        replayActionMain(store);
        return store;
    } else if (scope === "renderer") {
        if (history === null) {
            throw Error("history must be supplied for renderer store")
        }
        const sagaMiddleware = createSagaMiddleware();
        const routerMiddleware = createRouterMiddleware(history);
        const middlewares = [forwardToMain, sagaMiddleware, routerMiddleware];
        const store = createRendererStoreWithHotReload(history, middlewares);
        runRendererRootSagaWithHotReload(sagaMiddleware,store)
        replayActionRenderer(store);
        return store
    } else {
        throw Error("unexpected scope")
    }
}
