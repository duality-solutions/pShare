import { push } from "connected-react-router";
import { Task } from "redux-saga";
import { cancel, put, select, take, takeLatest } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { ActionCreator } from "typesafe-actions/dist/types";
import { RendererRootState } from "../reducers";
import { appRoutes, pushRoute, RouteInfo } from "../routes/appRoutes";
import RootActions from "./../../shared/actions";

//const delay = (time: number) => new Promise(r => setTimeout(r, time));

export function* navSaga() {
    console.log("nav saga started")
    const appInitializedAction = getType(RootActions.appInitialized);
    yield take(appInitializedAction);
    console.log("nav saga init")

    const state: RendererRootState = yield select()
    if (!state.user.syncAgreed) {
        console.log("nav saga navigating to /SyncAgree")

        yield put(pushRoute(appRoutes.syncAgree))
        const userSyncAgreedAction = getType(RootActions.userAgreeSync)
        console.log("nav saga waiting for userSyncAgreedAction")

        yield take(userSyncAgreedAction)
        console.log("nav saga userSyncAgreedAction")

    }
    console.log("nav saga navigating to /Sync")

    yield put(pushRoute(appRoutes.sync))
    // const syncPageStartTime = performance.now();
    const syncCompleteAction = getType(RootActions.syncComplete)
    console.log("nav saga waiting for syncCompleteAction")

    yield take(syncCompleteAction)


    const newState: RendererRootState = yield select()
    if (newState.user.isOnboarded) {
        console.log("nav saga: user is onboarded, navigating to /Main")
        yield put(pushRoute(appRoutes.main))
    }
    else {
        console.log("nav saga: navigating to Onboarding -- /CreateAccount")
        yield put(pushRoute(appRoutes.createAccount))
        console.log("nav saga navigating to /CreateAccount")

        const navMap = new Map<string, [string, boolean]>()
        const registerNavAction = <T extends string>(
            action: ActionCreator<T>,
            route: RouteInfo,
            shouldCancel: boolean = false
        ) =>
            navMap.set(getType(action), [route.path, shouldCancel])

        registerNavAction(RootActions.createAccount, appRoutes.enterUserName)
        registerNavAction(RootActions.userNameCaptured, appRoutes.enterCommonName)
        registerNavAction(RootActions.commonNameCaptured, appRoutes.enterToken)
        registerNavAction(RootActions.tokenCaptured, appRoutes.creatingBdapAccount)
        registerNavAction(RootActions.resetOnboarding, appRoutes.enterUserName)
        registerNavAction(RootActions.createBdapAccountComplete, appRoutes.passwordCreate, true)
        registerNavAction(RootActions.passwordCaptured, appRoutes.main)

        const bdapAccountTask: Task =
            yield takeLatest((action: RootActions) => navMap.has(action.type), function* (action: RootActions) {
                const navTarget = navMap.get(action.type)
                if (typeof navTarget !== 'undefined') {
                    const [route, shouldCancel] = navTarget
                    yield put(push(route))
                    if (shouldCancel) {
                        yield cancel(bdapAccountTask)
                    }
                }
            })

    }



}