import {
    SagaMiddleware, Task,
} from "redux-saga";

import { fork, take, call, cancel, ForkEffect, takeEvery } from "redux-saga/effects";

import { getRootSaga } from "../../sagas";
import { BrowserWindowProvider } from "../../../shared/system/BrowserWindowProvider";
import { getType } from "typesafe-actions";
import { AppActions } from "../../../shared/actions/app";
import { getLockedCommandQueue } from "../../../main/sagas/effects/helpers/lockedCommandQueue/getLockedCommandQueue";
import { LockedCommandQueueRunner } from "../../../main/sagas/effects/helpers/lockedCommandQueue/LockedCommandQueueRunner";
import { RpcClient, RpcClientWrapper } from "../../../main/RpcClient";
import { initializationSaga } from "../../../main/sagas/initializationSaga";
import { storeHydrationSaga } from "../../../main/sagas/storeHydrationSaga";
import { createCancellationToken, CancellationToken } from "../../../shared/system/createCancellationToken";
import { getRpcClient } from "../../../main/getRpcClient";

export function runRootSagaWithHotReload(sagaMw: SagaMiddleware<{}>, browserWindowProvider: BrowserWindowProvider, storeCancellationToken: CancellationToken) {
    let rpcClient: RpcClientWrapper | undefined;
    const getSagaTask = () => sagaMw.run(function* () {

        const cancellationToken = createCancellationToken(undefined, storeCancellationToken)
        yield take(getType(AppActions.initializeApp))
        const getRootSagaTask = (): ForkEffect => fork(function* () {
            yield takeEvery(getType(AppActions.shuttingDown), function* () {
                yield* orchestrateShutdown(rpcClient, rootSagaTask, cancellationToken);

            })
            yield takeEvery(getType(AppActions.initializeApp), function* () {
                yield* orchestrateRestart(rpcClient, rootSagaTask);
                rootSagaTask = yield getRootSagaTask()
            })
            yield takeEvery(getType(AppActions.sleep), function* () {
                orchestrateSleep(rpcClient, rootSagaTask)
                rootSagaTask = yield getRootSagaTask()
            })
            yield fork(storeHydrationSaga)
            rpcClient = yield* initializationSaga(async () => rpcClient || (await getRpcClient(cancellationToken)))
            if (!rpcClient) {
                throw Error("rpcClient is unexpectedly undefined")
            }
            const sagas = getRootSaga(rpcClient, browserWindowProvider);
            console.log("forking root sagas")
            for (let s of sagas) {
                yield fork(s)
            }

        })
        let rootSagaTask: Task = yield getRootSagaTask()



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
function* orchestrateShutdown(rpcClient: RpcClientWrapper | undefined, rootSagaTask: Task, cancellationToken: CancellationToken) {
    console.log("orchestrating shutdown");
    yield cancelEverything(rpcClient, rootSagaTask);
    console.log("quitting application");
    cancellationToken.cancel();
}

function* orchestrateRestart(rpcClient: RpcClient | undefined, rootSagaTask: Task) {
    console.log("orchestrating restart")
    const restartable: Restartable | undefined = yield cancelEverything(rpcClient, rootSagaTask);
    console.log("restarting application")
    if (restartable) {
        yield call(() => restartable.restart());

    }

}

function* orchestrateSleep(rpcClient: RpcClient | undefined, rootSagaTask: Task) {
    console.log("orchestrating shutdown")
    const restartable: Restartable | undefined = yield cancelEverything(rpcClient, rootSagaTask);
    yield take(getType(AppActions.initializeApp))
    if (restartable) {
        yield call(() => restartable.restart());

    }
}
interface Restartable {
    restart: () => Promise<void>
}
function cancelEverything(rpcClient: RpcClient | undefined, rootSagaTask: Task) {
    return call(function* () {
        console.warn("cancelling all sagas")
        yield cancel(rootSagaTask);
        console.warn("rootSagaTask cancelled")
        if (rpcClient) {
            const lockedCommandQueueRunner: LockedCommandQueueRunner = yield call(() => getLockedCommandQueue(rpcClient));
            console.log("got lockedCommandQueueRunner")
            lockedCommandQueueRunner.cancel();
            console.log("cancelled lockedCommandQueueRunner")
            yield call(() => lockedCommandQueueRunner.finished);
            console.warn("LockedCommandQueueRunner stopped")

            const restartable: Restartable = {
                restart: () => {
                    console.warn("LockedCommandQueueRunner restarting")
                    return lockedCommandQueueRunner.restart()
                }
            };
            console.log("app successfully shutdown")
            return restartable;
        }

    })
}


