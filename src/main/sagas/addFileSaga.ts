import { takeEvery, select, call, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { AddFileActions } from "../../shared/actions/addFile";
import * as fsExtra from 'fs-extra'
import * as path from 'path'
import { app } from "electron";
import { MainRootState } from "../reducers";

const pathToShareDirectory = path.join(app.getPath("home"), ".pshare", "share");

export function* addFileSaga() {
    yield takeEvery(getType(AddFileActions.filesSelected), function* (action: ActionType<typeof AddFileActions.filesSelected>) {
        const linkedUserName: string | undefined = yield select((s: MainRootState) => s.sharedFiles.linkedUserName)
        if (!linkedUserName) {
            return
        }
        const targetDirectory = path.join(pathToShareDirectory, linkedUserName, "out")
        yield call(() => fsExtra.ensureDir(targetDirectory))
        const filePathInfos = action.payload;

        for (const fpi of filePathInfos) {
            console.log("filePathInfo : " + fpi.path)
            const fileName = path.basename(fpi.path)
            const dest = path.join(targetDirectory, fileName)
            yield call(() => fsExtra.copy(fpi.path, dest, { errorOnExist: true }))
        }
        yield put(AddFileActions.close())
    })
}