import {
    SagaMiddleware, Task,
} from "redux-saga";

import { fork, take, call, cancel, ForkEffect, takeEvery, put } from "redux-saga/effects";

import { getRootSaga } from "../../sagas";
import { BrowserWindowProvider } from "../../../shared/system/BrowserWindowProvider";
import { getType } from "typesafe-actions";
import { AppActions } from "../../../shared/actions/app";
import { getLockedCommandQueue } from "../../../main/sagas/effects/helpers/lockedCommandQueue/getLockedCommandQueue";
import { LockedCommandQueueRunner } from "../../../main/sagas/effects/helpers/lockedCommandQueue/LockedCommandQueueRunner";
import { RpcClient, RpcClientWrapper } from "../../../main/RpcClient";
import { initializationSaga } from "../../../main/sagas/initializationSaga";
import { storeHydrationSaga } from "../../../main/sagas/storeHydrationSaga";
import { createCancellationTokenSource, CancellationTokenSource } from "../../../shared/system/createCancellationTokenSource";
import { getRpcClient } from "../../../main/getRpcClient";
import { app, MessageBoxOptions, dialog } from "electron";
import { actionLoggingSaga } from "../../sagas/actionLoggingSaga";
import { remoteLoggingSaga } from "../../sagas/remoteLoggingSaga";
import { EventDispatcher } from "../../../shared/system/events/EventDispatcher";
import { createStoreWithHotReload } from "./createStoreWithHotReload";

export function runRootSagaWithHotReload(sagaMw: SagaMiddleware<{}>, browserWindowProvider: BrowserWindowProvider, sagaMonitor: EventDispatcher, store: ReturnType<typeof createStoreWithHotReload>) {
    let rpcClient: RpcClientWrapper | undefined;
    const getSagaTask = () => sagaMw.run(function* () {
        yield takeEvery(getType(AppActions.shuttingDown), function* () {
            yield* orchestrateShutdown(rpcClient, rootSagaTask, cancellationTokenSource);

        })
        yield takeEvery(getType(AppActions.initializeApp), function* () {
            yield* orchestrateRestart(rpcClient, rootSagaTask);
            rootSagaTask = yield getRootSagaTask()
        })
        // yield takeEvery(getType(AppActions.sleep), function* () {
        //     orchestrateSleep(rpcClient, rootSagaTask)
        //     rootSagaTask = yield getRootSagaTask()
        // })
        const cancellationTokenSource = createCancellationTokenSource()
        sagaMonitor.addEventListener("error", e => {
            console.log("sagamonitor error")
            cancellationTokenSource.cancel().then(() => {
                store.dispatch(AppActions.terminated());
                const messageBoxOptions: MessageBoxOptions = {
                    type: "error",
                    title: "Error",
                    message: `Oops, it looks like something's gone wrong`,
                    detail: `Sorry, the application will now close.\nMaybe restarting will help.${e.message ? `\nThe error was : ${e.message}` : ""}`,
                    normalizeAccessKeys: true,
                    buttons: ["&Ok"],
                    noLink: true,
                    cancelId: 0,
                    defaultId: 0
                };
                const win = browserWindowProvider();
                if (win) {
                    dialog.showMessageBox(win, messageBoxOptions, (res, checked) => {
                        app.quit()
                    });
                } else {
                    dialog.showMessageBox(messageBoxOptions, (res, checked) => {
                        app.quit()
                    });
                }


            })
        })
        const cancellationToken = cancellationTokenSource.getToken()
        yield take(getType(AppActions.initializeApp))
        const getRootSagaTask = (): ForkEffect => fork(function* () {

            yield fork(remoteLoggingSaga)

            yield fork(storeHydrationSaga)
            yield fork(() => actionLoggingSaga("Main Store"))


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
function* orchestrateShutdown(rpcClient: RpcClientWrapper | undefined, rootSagaTask: Task, cancellationTokenSource: CancellationTokenSource) {
    console.log("orchestrating shutdown");
    yield put(AppActions.terminated())
    yield cancelEverything(rpcClient, rootSagaTask);
    console.log("quitting application");
    yield call(() => cancellationTokenSource.cancel());

    app.quit()
}

function* orchestrateRestart(rpcClient: RpcClient | undefined, rootSagaTask: Task) {
    console.log("orchestrating restart")
    const restartable: Restartable | undefined = yield cancelEverything(rpcClient, rootSagaTask);
    console.log("restarting application")
    if (restartable) {
        yield call(() => restartable.restart());

    }

}

// function* orchestrateSleep(rpcClient: RpcClient | undefined, rootSagaTask: Task) {
//     console.log("orchestrating shutdown")
//     const restartable: Restartable | undefined = yield cancelEverything(rpcClient, rootSagaTask);
//     yield take(getType(AppActions.initializeApp))
//     if (restartable) {
//         yield call(() => restartable.restart());

//     }
// }
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


