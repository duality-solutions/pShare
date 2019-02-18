import { takeEvery } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { AppActions } from "../../shared/actions/app";
import { app } from "electron";
export function* shutdownSaga() {
    yield takeEvery(getType(AppActions.shutdown), function () {
        app.quit();
    });
}
