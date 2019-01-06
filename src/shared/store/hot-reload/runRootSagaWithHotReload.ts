import { SagaMiddleware } from "redux-saga";

import { fork } from "redux-saga/effects";

import { getRootSaga } from "../../sagas";
import { Store } from "redux";
import { RootState } from "../../reducers";
import RootActions from "../../actions";

export default function runRootSagaWithHotReload(sagaMw: SagaMiddleware<{}>,store:Store<RootState,RootActions>) {
    
    const getSagaTask = () => sagaMw.run(function* () {
        const sagas = getRootSaga();
        for(let s of sagas){
            yield fork(s)
            console.log("forked")
        }
    });
    let sagaTask = getSagaTask();
    if (module.hot) {
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