import { History } from 'history'
import { createEpicMiddleware } from 'redux-observable'
import createSagaMiddleware from 'redux-saga'
import createRouterMiddleware from '../system/createRouterMiddleware';
import createStoreWithHotReload from './hot-reload/createStoreWithHotReload';
import runRootEpicWithHotReload from './hot-reload/runRootEpicWithHotReload';
import runRootSagaWithHotReload from './hot-reload/runRootSagaWithHotReload';

export function configureStore(history: History) {
    const routerMiddleware = createRouterMiddleware(history);
    const epicMiddleware = createEpicMiddleware()
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware, routerMiddleware, epicMiddleware]
    const store = createStoreWithHotReload(history, middlewares);
    runRootEpicWithHotReload(epicMiddleware);
    runRootSagaWithHotReload(sagaMiddleware,store);
    return store
}
