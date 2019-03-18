import {
    SagaMiddleware, Task,
} from "redux-saga";

import { fork, take, call, cancel, race } from "redux-saga/effects";

import { getRootSaga } from "../../sagas";
import { BrowserWindowProvider } from "../../../shared/system/BrowserWindowProvider";
import { getType } from "typesafe-actions";
import { AppActions } from "../../../shared/actions/app";
import { getLockedCommandQueue } from "../../../main/sagas/effects/helpers/lockedCommandQueue/getLockedCommandQueue";
import { LockedCommandQueueRunner } from "../../../main/sagas/effects/helpers/lockedCommandQueue/LockedCommandQueueRunner";
import { app } from "electron";
import { RpcClient, RpcClientWrapper } from "../../../main/RpcClient";
import { initializationSaga } from "../../../main/sagas/initializationSaga";
import { storeHydrationSaga } from "../../../main/sagas/storeHydrationSaga";
import { createCancellationToken } from "../../../shared/system/createCancellationToken";
import { getRpcClient } from "../../../main/getRpcClient";

export function runRootSagaWithHotReload(sagaMw: SagaMiddleware<{}>, browserWindowProvider: BrowserWindowProvider) {

    const getSagaTask = () => sagaMw.run(function* () {
        let rpcClient: RpcClientWrapper | undefined;
        const cancellationToken = createCancellationToken()
        yield take(getType(AppActions.initializeApp))

        for (; ;) {
            yield fork(storeHydrationSaga)
            rpcClient = yield* initializationSaga(async () => rpcClient || (await getRpcClient(cancellationToken)))
            if (!rpcClient) {
                throw Error("rpcClient is unexpectedly undefined")
            }
            const sagas = getRootSaga(rpcClient, browserWindowProvider);
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

            if (shutdown) {
                yield* orchestrateShutdown(rpcClient, rootSagaTask, cancellationToken);
                return;
            }
            else if (initializing) {
                yield* orchestrateRestart(rpcClient, rootSagaTask);
                continue

            }
            else {
                yield* orchestrateSleep(rpcClient, rootSagaTask);
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
function* orchestrateShutdown(rpcClient: RpcClientWrapper, rootSagaTask: Task, cancellationToken: import("/home/spender/Desktop/pShare/p-share-ui/src/shared/system/createCancellationToken").CancellationToken) {
    console.log("orchestrating shutdown");
    yield cancelEverything(rpcClient, rootSagaTask);
    console.log("quitting application");
    cancellationToken.cancel();
    app.quit();
}

function* orchestrateRestart(rpcClient: RpcClient, rootSagaTask: Task) {
    console.log("orchestrating restart")
    const restartable: Restartable = yield cancelEverything(rpcClient, rootSagaTask);
    console.log("restarting application")
    yield call(() => restartable.restart());

}

function* orchestrateSleep(rpcClient: RpcClient, rootSagaTask: Task) {
    console.log("orchestrating shutdown")
    const restartable: Restartable = yield cancelEverything(rpcClient, rootSagaTask);
    yield take(getType(AppActions.initializeApp))
    yield call(() => restartable.restart());
}
interface Restartable {
    restart: () => Promise<void>
}
function cancelEverything(rpcClient: RpcClient, rootSagaTask: Task) {
    return call(function* () {
        console.warn("cancelling all sagas")
        yield cancel(rootSagaTask);
        console.warn("rootSagaTask cancelled")
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
    })
}


