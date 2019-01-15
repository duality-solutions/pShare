import { SagaMiddleware } from "redux-saga";

import { fork } from "redux-saga/effects";

import { getRootSaga } from "../../sagas";

export default function runRootSagaWithHotReload(sagaMw: SagaMiddleware<{}>) {
    
    const getSagaTask = () => sagaMw.run(function* () {
        const sagas = getRootSaga();
        for(let s of sagas){
            yield fork(s)
            console.log("forked")
        }
    });
    let sagaTask = getSagaTask();
    if (!process.env.NODE_ENV && module.hot) {
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
