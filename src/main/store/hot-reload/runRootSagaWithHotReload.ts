import { SagaMiddleware, Task } from "redux-saga";

import { fork, take, call, cancel, race } from "redux-saga/effects";

import { getRootSaga } from "../../sagas";
import { BrowserWindowProvider } from "../../../shared/system/BrowserWindowProvider";
import { getType } from "typesafe-actions";
import { AppActions } from "../../../shared/actions/app";
import { getLockedCommandQueue } from "../../../main/sagas/effects/helpers/lockedCommandQueue/getLockedCommandQueue";
import { LockedCommandQueueRunner } from "../../../main/sagas/effects/helpers/lockedCommandQueue/LockedCommandQueueRunner";
import { app } from "electron";
import { RpcClient } from "../../../main/RpcClient";
import { getRpcClient } from "../../../main/getRpcClient";

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

            const { initializing, shutdown } = yield race({
                shutdown: take(getType(AppActions.shuttingDown)),
                initializing: take(getType(AppActions.initializeApp)),
                sleep: take(getType(AppActions.sleep)),
            })

            if (initializing) {
                yield* orchestrateRestart(rootSagaTask);
                continue

            }
            else if (shutdown) {
                yield* orchestrateShutdown(rootSagaTask);
                return;
            }
            else {
                yield* orchestrateSleep(rootSagaTask);
                continue
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
function* orchestrateRestart(rootSagaTask: Task) {
    console.log("orchestrating restart")
    const restartable: Restartable = yield cancelEverything(rootSagaTask);
    yield call(() => restartable.restart());
    console.log("restarting")

}

function* orchestrateShutdown(rootSagaTask: Task) {
    console.log("orchestrating shutdown")
    yield cancelEverything(rootSagaTask);
    console.log("quitting application")
    const client: RpcClient = yield call(getRpcClient);
    client.dispose()
    app.quit();
}
function* orchestrateSleep(rootSagaTask: Task) {
    console.log("orchestrating shutdown")
    const restartable: Restartable = yield cancelEverything(rootSagaTask);
    yield take(getType(AppActions.initializeApp))
    yield call(() => restartable.restart());
}
interface Restartable {
    restart: () => Promise<void>
}
function cancelEverything(rootSagaTask: Task) {
    return call(function* () {
        console.warn("cancelling all sagas")
        yield cancel(rootSagaTask);
        console.warn("cancelling LockedCommandQueueRunner")
        const lockedCommandQueueRunner: LockedCommandQueueRunner = yield call(() => getLockedCommandQueue());
        lockedCommandQueueRunner.cancel();
        yield call(() => lockedCommandQueueRunner.finished);
        console.warn("LockedCommandQueueRunner fully stopped")

        const restartable: Restartable = {
            restart: () => {
                console.warn("LockedCommandQueueRunner restarting")
                return lockedCommandQueueRunner.restart()
            }
        };
        console.log("everything cancelled")
        return restartable;
    })
}


