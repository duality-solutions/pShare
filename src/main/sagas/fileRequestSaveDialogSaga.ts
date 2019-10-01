import { takeEvery, call, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { FileSharingActions } from "../../shared/actions/fileSharing";
import { dialog, app, BrowserWindow } from "electron";
import { BrowserWindowProvider } from "../../shared/system/BrowserWindowProvider";
import * as path from "path"
import { FileRequest } from "../../shared/actions/payloadTypes/FileRequest";

export function* requestFileSaveDialogSaga(browserWindowProvider: BrowserWindowProvider) {
    yield takeEvery(getType(FileSharingActions.requestFile), function* (action: ActionType<typeof FileSharingActions.requestFile>) {
        const browserWindow = browserWindowProvider();
        if (browserWindow == null) {
            return
        }
        const fileRequest = action.payload
        let savePath: string
        try {
            savePath = yield* getSavePath(fileRequest, browserWindow);
        } catch (err) {
            if (err.message === "cancelled") {
                return;
            }
            throw err
        }
        yield put(FileSharingActions.requestFileWithSavePath({ ...fileRequest, savePath, type: "file" }))
    })
}

function* getSavePath(fileRequest: FileRequest, browserWindow: BrowserWindow) {
    const fileName = path.basename(path.normalize(fileRequest.fileName));
    const downloadsDir = app.getPath("downloads");
    const defaultSavePath = path.join(downloadsDir, fileName);
    const showDialog = () => new Promise<string>((resolve, reject) => {
        dialog
            .showSaveDialog(browserWindow, {
                buttonLabel: "Save",
                defaultPath: defaultSavePath,
                title: `Save ${fileName} as...`
            }, (filename) => {
                if (filename) {
                    resolve(filename);
                }
                else {
                    reject(Error("cancelled"));
                }
            });
    });
    const savePath: string = yield call(() => showDialog());
    return savePath;
}
