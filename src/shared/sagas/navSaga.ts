import { getType } from "typesafe-actions";
import RootActions from "../actions";
import { take, put, select } from "redux-saga/effects";
import { push } from "connected-react-router";
import { RendererRootState } from "../reducers";

export function* navSaga() {
    console.log("nav saga started")
    const initializeAppAction = getType(RootActions.initializeApp);
    yield take(initializeAppAction);
    console.log("nav saga init")

    const state:RendererRootState = yield select()
    if(!state.user.syncAgreed){
        console.log("nav saga navigating to /SyncAgree")

        yield put(push("/SyncAgree"))
        const userSyncAgreedAction = getType(RootActions.userAgreeSync)
        console.log("nav saga waiting for userSyncAgreedAction")

        yield take(userSyncAgreedAction)
        console.log("nav saga userSyncAgreedAction")

    }
    console.log("nav saga navigating to /Sync")

    yield put(push("/Sync"))
    const syncCompleteAction = getType(RootActions.syncComplete)
    console.log("nav saga waiting for syncCompleteAction")

    yield take(syncCompleteAction)
    console.log("nav saga navigating to /Main")

    yield put(push("/Main"))
}