import { takeEvery, put, call } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { BrowserWindowProvider } from "../../shared/system/BrowserWindowProvider";
import { AddFileActions } from "../../shared/actions/addFile";
import { app, BrowserWindow, dialog } from "electron";
import * as fs from 'fs';
import * as path from 'path'
import { promisify } from 'util'

export function* fileDialogSaga(browserWindowProvider: BrowserWindowProvider) {
    yield takeEvery(getType(AddFileActions.showFileSelectDialog), function* () {
        const browserWindow = browserWindowProvider();
        if (!browserWindow) {
            return;
        }
        const filePaths: string[] = yield call(() => getFilePathSync(browserWindow));
        if (!filePaths) {
            return;
        }
        const allFilePaths: string[] = yield call(() => getAllFilePaths(filePaths))
        console.log(allFilePaths)
    })
    yield put(AddFileActions.showFileSelectDialog())
}
const exists = promisify(fs.exists)

async function getAllFilePaths(filePaths: string[], visited: Set<string> | undefined = undefined): Promise<string[]> {
    if (filePaths.length === 0) {
        return [];
    }
    const visitedSet = visited || new Set<string>();
    const files: string[] = [];
    for (const pth of filePaths) {
        const normalizedPath = await fs.promises.realpath(path.normalize(pth));
        if (visitedSet.has(normalizedPath)) {
            continue
        }
        visitedSet.add(normalizedPath)
        const pathExists = await exists(normalizedPath)
        if (!pathExists) {
            continue
        }
        const stat: fs.Stats = await fs.promises.lstat(normalizedPath)

        if (stat.isFile()) {
            files.push(normalizedPath)
        } else if (stat.isDirectory()) {
            const dirContents = await fs.promises.readdir(normalizedPath)
            const dirContentsPaths = dirContents.map(p => path.join(normalizedPath, p))
            const dPaths = await getAllFilePaths(dirContentsPaths, visitedSet)
            files.push(...dPaths)
        }
    }

    //const subDirFiles = await getAllFilePaths(directories, visitedSet);
    return files
}
async function getFilePathSync(window: BrowserWindow): Promise<string[] | null> {
    const homeDir = app.getPath("documents");
    const result = await dialog.showOpenDialog(window, {
        // filters: [
        //     {
        //         name: "p-share wallet key backup",
        //         extensions: ["psh.json"]
        //     }
        // ],
        defaultPath: homeDir,
        title: "Select files and/or directories for import",
        properties: ['openFile', 'openDirectory', "multiSelections"]

    });
    const path = result.filePaths
    if (path == null) {
        return null;
    }
    return path
}