import { SagaMiddleware } from "redux-saga";
import { fork } from "redux-saga/effects";
import { getRendererRootSaga } from "../../sagas";
import { Store } from "redux";
import { RendererRootState } from "../../reducers";
import RootActions from "../../actions";
export default function runRendererRootSagaWithHotReload(sagaMw: SagaMiddleware<{}>, store: Store<RendererRootState, RootActions>) {
    const getSagaTask = () => sagaMw.run(function* () {
        const sagas = getRendererRootSaga();
        for (let s of sagas) {
            yield fork(s);
            console.log("forked");
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
