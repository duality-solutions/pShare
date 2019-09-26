import { takeEvery, select, call, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { AddFileActions } from "../../shared/actions/addFile";
import * as fsExtra from 'fs-extra'
import * as fs from 'fs';
import * as path from 'path'
import { app } from "electron";
import { MainRootState } from "../reducers";
import { FilePathInfo } from "../../shared/types/FilePathInfo";

const pathToShareDirectory = path.join(app.getPath("home"), ".pshare", "share");

export function* addFileSaga() {
    yield takeEvery(getType(AddFileActions.filesSelected), function* (action: ActionType<typeof AddFileActions.filesSelected>) {


        const filesAndDirectories: SortedFileInfoCollection = yield call(() => sortFileInfosToFileOrDirectories(action.payload))

        const filePathInfos = filesAndDirectories.files;

        console.log("rejecting", filesAndDirectories.directories)

        const linkedUserName: string | undefined = yield select((s: MainRootState) => s.sharedFiles.linkedUserName)
        if (!linkedUserName) {
            return
        }
        const baseDirectory = path.join(pathToShareDirectory, linkedUserName, "out");
        const currentPath = yield select((s: MainRootState) => s.fileNavigation.sharedFilesViewPath.join("/"))

        const targetDirectory = path.join(baseDirectory, currentPath)

        yield call(() => fsExtra.ensureDir(targetDirectory))

        for (const fpi of filePathInfos) {
            console.log("filePathInfo : " + fpi.path)
            const fileName = path.basename(fpi.path)
            const [firstSeg, ...remainingSegs] = fileName.split(".");
            for (let i = 0; ; i++) {
                const dest = path.join(targetDirectory, i === 0 ? fileName : `${firstSeg}(${i})${["", ...remainingSegs].join(".")}`);

                try {
                    yield call(() => fsExtra.copy(fpi.path, dest, { errorOnExist: true, overwrite: false }))
                } catch (err) {
                    if (/ already exists$/.test(err.message)) {
                        continue
                    }
                    throw err
                }
                break
            }
        }
        yield put(AddFileActions.close())
    })
}

interface SortedFileInfoCollection {
    files: FilePathInfo[]
    directories: FilePathInfo[]
}

async function sortFileInfosToFileOrDirectories(fileInfos: FilePathInfo[]): Promise<SortedFileInfoCollection> {
    const files: FilePathInfo[] = []
    const directories: FilePathInfo[] = []
    for (const fileInfo of fileInfos) {
        const normalizedPath = await fs.promises.realpath(path.normalize(fileInfo.path));
        const stat: fs.Stats = await fs.promises.stat(normalizedPath);
        if (stat.isDirectory()) {
            directories.push(fileInfo)
        } else if (stat.isFile()) {
            files.push(fileInfo)
        }
    }
    return { files, directories }

}