import { push } from "connected-react-router";
import { put, take, takeLatest, cancel, call } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import RootActions from "../../../shared/actions";
import { ActionCreator, ActionType } from "typesafe-actions/dist/types";
import { Task, Predicate } from "redux-saga";
import { RouteInfo } from "../../routes/appRoutes";
import { createLocalStandardAction } from "../../../shared/system/createLocalStandardAction";
import { Action } from "redux";
import { v4 as uuid } from 'uuid';
export function getNavMap() {
    const navMap = new Map<string, [string, boolean]>();
    const registerNavAction = <T extends string>(action: ActionCreator<T>, route: RouteInfo, shouldCancel: boolean = false) => navMap.set(getType(action), [route.path, shouldCancel]);
    const id = uuid()
    const runNav = () => call(function* () {
        const task: Task = yield takeLatest((action: RootActions) => navMap.has(action.type), function* (action: RootActions) {
            const navTarget = navMap.get(action.type);
            if (typeof navTarget !== 'undefined') {
                const [route, shouldCancel] = navTarget;
                yield put(push(route));
                if (shouldCancel) {
                    yield put(NavMapActions.navMapComplete(id));
                    yield cancel(task);
                }
            }
        });
        const pred = ((action: NavMapActions) => getType(NavMapActions.navMapComplete) === action.type && action.payload === id) as Predicate<Action<any>>
        yield take(pred);
    });
    return { registerNavAction, runNav };
}
const NavMapActions = {
    navMapComplete: createLocalStandardAction('navMap/COMPLETE')<string>(),
};
type NavMapActions = ActionType<typeof NavMapActions>;
