import { SagaMiddleware, Task } from "redux-saga";

import { fork, take, call, cancel, race } from "redux-saga/effects";

import { getRootSaga } from "../../sagas";
import { BrowserWindowProvider } from "../../../shared/system/BrowserWindowProvider";
import { getType } from "typesafe-actions";
import { AppActions } from "../../../shared/actions/app";
import { getLockedCommandQueue } from "../../../main/sagas/effects/helpers/lockedCommandQueue/getLockedCommandQueue";
import { LockedCommandQueueRunner } from "../../../main/sagas/effects/helpers/lockedCommandQueue/LockedCommandQueueRunner";
import { app } from "electron";

export function runRootSagaWithHotReload(sagaMw: SagaMiddleware<{}>, browserWindowProvider: BrowserWindowProvider) {

    const getSagaTask = () => sagaMw.run(function* () {
        yield take(getType(AppActions.initializeApp))
        for (; ;) {
            const sagas = getRootSaga(browserWindowProvider);
            const rootSagaTask: Task = yield fork(function* () {
                console.log("forking root sagas")
                for (let s of sagas) {
                    yield fork(s)
                }
            })

            const { initializing } = yield race({
                shutdown: take(getType(AppActions.shuttingDown)),
                initializing: take(getType(AppActions.initializeApp))
            })

            if (initializing) {
                yield* coordinateRestart(rootSagaTask);
                continue

            }
            else {
                yield* coordinateShutdown(rootSagaTask);
                return;
            }
        }


    });
    let sagaTask = getSagaTask();
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (isDevelopment && module.hot) {
        module.hot.accept('../../sagas', () => {
            console.info("hot-reloading sagas");
            sagaTask.cancel();
            sagaTask.done.then(() => {
                sagaTask = getSagaTask();
                console.warn("sagas reloaded");
            });
        });
    }
}
function* coordinateRestart(rootSagaTask: Task) {
    console.warn("re-initializing. killing root sagas");
    yield cancel(rootSagaTask);
    console.warn("shutting down lockedCommandQueueRunner");
    const lockedCommandQueueRunner: LockedCommandQueueRunner = yield call(() => getLockedCommandQueue());
    lockedCommandQueueRunner.cancel();
    yield call(() => lockedCommandQueueRunner.finished);
    console.warn("lockedCommandQueueRunner finished. restarting");
    yield call(() => lockedCommandQueueRunner.restart());
}

function* coordinateShutdown(rootSagaTask: Task) {
    const lockedCommandQueueRunner: LockedCommandQueueRunner = yield call(() => getLockedCommandQueue());
    lockedCommandQueueRunner.cancel();
    yield call(() => lockedCommandQueueRunner.finished);
    yield cancel(rootSagaTask);
    app.quit();
}

