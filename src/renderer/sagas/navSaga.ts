import { push } from "connected-react-router";
import { put, select, take, takeLatest } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { RendererRootState } from "../reducers";
import RootActions from "./../../shared/actions";
import { ActionCreator } from "typesafe-actions/dist/types";

//const delay = (time: number) => new Promise(r => setTimeout(r, time));

export function* navSaga() {
    console.log("nav saga started")
    const appInitializedAction = getType(RootActions.appInitialized);
    yield take(appInitializedAction);
    console.log("nav saga init")

    const state: RendererRootState = yield select()
    if (!state.user.syncAgreed) {
        console.log("nav saga navigating to /SyncAgree")

        yield put(push("/SyncAgree"))
        const userSyncAgreedAction = getType(RootActions.userAgreeSync)
        console.log("nav saga waiting for userSyncAgreedAction")

        yield take(userSyncAgreedAction)
        console.log("nav saga userSyncAgreedAction")

    }
    console.log("nav saga navigating to /Sync")

    yield put(push("/Sync"))
    // const syncPageStartTime = performance.now();
    const syncCompleteAction = getType(RootActions.syncComplete)
    console.log("nav saga waiting for syncCompleteAction")

    yield take(syncCompleteAction)


    const newState: RendererRootState = yield select()
    if (newState.user.isOnboarded) {
        console.log("nav saga: user is onboarded, navigating to /Main")
        yield put(push("/Main"))
    }
    else {
        console.log("nav saga: navigating to Onboarding -- /CreateAccount")
        yield put(push("/CreateAccount"))
        console.log("nav saga navigating to /CreateAccount")
    }

    const navMap = new Map<string, string>()
    const registerNavAction = <T extends string>(action: ActionCreator<T>, route: string) => navMap.set(getType(action), route)
    registerNavAction(RootActions.createAccount, "/EnterUserName")
    registerNavAction(RootActions.enterUserName, "/EnterCommonName")
    registerNavAction(RootActions.enterCommonName, "/EnterToken")
    registerNavAction(RootActions.enterToken, "/CreatingBdapAccount")
    registerNavAction(RootActions.enterCreatingBdapAccount, "/Main")
    registerNavAction(RootActions.resetOnboarding, "/EnterUserName")

    yield takeLatest((action: RootActions) => navMap.has(action.type), function* (action: RootActions) {
        const navTarget = navMap.get(action.type)
        if (typeof navTarget !== 'undefined') {
            yield put(push(navTarget))
        }
    })

}