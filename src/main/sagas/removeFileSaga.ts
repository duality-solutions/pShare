import { takeEvery, put, call } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import * as fsExtra from 'fs-extra'
import { RemoveFileActions } from "../../shared/actions/removeFile";


export function* removeFileSaga() {
    yield takeEvery(getType(RemoveFileActions.removeSharedFile), function* (action: ActionType<typeof RemoveFileActions.removeSharedFile>) {
        yield call(() => fsExtra.remove(action.payload))

        yield put(RemoveFileActions.fileRemoved())
    })
}


