import { History } from 'history'
import { createEpicMiddleware } from 'redux-observable'
import createSagaMiddleware from 'redux-saga'
import createRouterMiddleware from '../system/createRouterMiddleware';
import { createRendererStoreWithHotReload, createMainStoreWithHotReload } from './hot-reload/createStoreWithHotReload';
//import runRootEpicWithHotReload from './hot-reload/runRootEpicWithHotReload';
import runRootSagaWithHotReload from './hot-reload/runRootSagaWithHotReload';
import {
    forwardToMain,
    forwardToRenderer,
    triggerAlias,
    replayActionMain,
    replayActionRenderer,
} from 'electron-redux';
import { StoreScope } from './StoreScope';
import runRootEpicWithHotReload from './hot-reload/runRootEpicWithHotReload';
export function configureStore(scope: StoreScope, history: History | null = null) {

    if (scope === "main") {
        const epicMiddleware = createEpicMiddleware()
        const sagaMiddleware = createSagaMiddleware();
        const middlewares = [triggerAlias, epicMiddleware, sagaMiddleware, forwardToRenderer];
        const store = createMainStoreWithHotReload(middlewares);
        //store.subscribe(() => console.log("main store!!!"))

        runRootEpicWithHotReload(epicMiddleware);
        runRootSagaWithHotReload(sagaMiddleware, store);
        replayActionMain(store);
        return store;
    } else if (scope === "renderer") {
        if (history === null) {
            throw Error("history must be supplied for renderer store")
        }
        const routerMiddleware = createRouterMiddleware(history);
        const middlewares = [forwardToMain, routerMiddleware];
        const store = createRendererStoreWithHotReload(history, middlewares);
        //store.subscribe(() => console.log("renderer store!!!"))
        replayActionRenderer(store);
        return store
    } else {
        throw Error("unexpected scope")
    }
    // const routerMiddleware = createRouterMiddleware(history);
    // const epicMiddleware = createEpicMiddleware()
    // const sagaMiddleware = createSagaMiddleware();
    //const middlewares = [sagaMiddleware, routerMiddleware, epicMiddleware]


}
