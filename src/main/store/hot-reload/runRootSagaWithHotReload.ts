import { SagaMiddleware, Task } from "redux-saga";

import { fork, take, call, put } from "redux-saga/effects";

import { getRootSaga } from "../../sagas";
import { BrowserWindowProvider } from "../../../shared/system/BrowserWindowProvider";
import { getType } from "typesafe-actions";
import { AppActions } from "../../../shared/actions/app";
import { getLockedCommandQueue } from "../../../main/sagas/effects/helpers/lockedCommandQueue/getLockedCommandQueue";
import { LockedCommandQueueRunner } from "../../../main/sagas/effects/helpers/lockedCommandQueue/LockedCommandQueueRunner";

export function runRootSagaWithHotReload(sagaMw: SagaMiddleware<{}>, browserWindowProvider: BrowserWindowProvider) {

    const getSagaTask = () => sagaMw.run(function* () {
        const sagas = getRootSaga(browserWindowProvider);
        const tasks: Task[] = [];
        for (let s of sagas) {
            const task: Task = yield fork(s)
            tasks.push(task)
            console.log("forked")
        }
        yield take(getType(AppActions.shuttingDown))
        const r: LockedCommandQueueRunner = yield call(() => getLockedCommandQueue())
        r.cancel()
        yield call(() => r.finished)

        yield put(AppActions.shutdown())
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
