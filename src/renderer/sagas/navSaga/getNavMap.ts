import { push } from "connected-react-router";
import { put, take, takeLatest, cancel, call } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { RootActions } from "../../../shared/actions";
import { ActionType, StringType, ActionCreator, TypeMeta } from "typesafe-actions/dist/types";
import { Task, Predicate } from "redux-saga";
import { RouteInfo } from "../../routes/appRoutes";
import { createLocalStandardAction } from "../../../shared/system/createLocalStandardAction";
import { Action } from "redux";
import { v4 as uuid } from 'uuid';
export function getNavMap() {
    const navMap = new Map<string, [string, boolean, undefined | (() => void)]>();
    const registerNavAction = <T extends StringType>(action: ActionCreator<T> & TypeMeta<T>, route: RouteInfo, stopOnThisAction: boolean = false, onNavigate?: () => void) =>
        navMap.set(getType(action), [route.path, stopOnThisAction, onNavigate]);
    const id = uuid()
    const runNav = () => call(function* () {
        const task: Task = yield takeLatest((action: RootActions) => navMap.has(action.type), function* (action: RootActions) {
            const navTarget = navMap.get(action.type);
            if (typeof navTarget !== 'undefined') {
                const [route, stopOnThisAction, onNavigate] = navTarget;
                yield put(push(route));
                onNavigate && onNavigate()
                if (stopOnThisAction) {
                    yield put(NavMapActions.navMapComplete(id));
                    yield cancel(task);
                }
            }
        });
        const pred = ((action: NavMapActions) => getType(NavMapActions.navMapComplete) === action.type && action.payload === id)
        yield take(pred as Predicate<Action<any>>);
    });
    return { registerNavAction, runNav };
}
const NavMapActions = {
    navMapComplete: createLocalStandardAction('navMap/COMPLETE')<string>(),
};
type NavMapActions = ActionType<typeof NavMapActions>;
