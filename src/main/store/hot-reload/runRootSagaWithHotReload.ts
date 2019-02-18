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
            const tasks: Task[] = [];
            for (let s of sagas) {
                const task: Task = yield fork(s)
                tasks.push(task)
                console.log("forked")
            }
            const { initializing } = yield race({ shutdown: take(getType(AppActions.shuttingDown)), initializing: take(getType(AppActions.initializeApp)) })

            if (initializing) {
                for (let t of tasks) {
                    yield cancel(t)
                }
                const lockedCommandQueueRunner: LockedCommandQueueRunner = yield call(() => getLockedCommandQueue())
                lockedCommandQueueRunner.cancel()
                yield call(() => lockedCommandQueueRunner.finished)
                yield call(() => lockedCommandQueueRunner.restart())
                continue

            }
            else {
                yield take(getType(AppActions.shuttingDown))
                const r: LockedCommandQueueRunner = yield call(() => getLockedCommandQueue())
                r.cancel()
                yield call(() => r.finished)
                for (let t of tasks) {
                    yield cancel(t)
                }
                app.quit()
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
