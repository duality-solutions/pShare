import { EpicMiddleware, ActionsObservable, StateObservable } from "redux-observable";
import { BehaviorSubject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { getRootEpic } from '../../epics';
import RootActions from "../../../shared/actions";
import { MainRootState } from "../../reducers";


export default function runEpicWithHotReload(epicMw: EpicMiddleware<RootActions>) {
    const getHotRootEpic = () => {
        //debugger
        const epic = getRootEpic();
        const epic$ = new BehaviorSubject(epic);
        const hotReloadingEpic = (a$: ActionsObservable<RootActions>, s$: StateObservable<MainRootState>, deps: {}) =>
            epic$.pipe(
                switchMap(epic => epic(a$, s$, deps))
            );

        if (!process.env.NODE_ENV && module.hot) {
            module.hot.accept('../../epics', () => {
                console.info("hot-reloading epics")
                epic$.next(getRootEpic());
                console.warn("epics reloaded");
            });
        }
        return hotReloadingEpic;
    }
    const rootEpic = getHotRootEpic();
    epicMw.run(rootEpic as any);
}