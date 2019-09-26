import { takeEvery, select, call, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { AddFileActions } from "../../shared/actions/addFile";
import * as fsExtra from 'fs-extra'
import * as fs from 'fs';
import * as path from 'path'
import { app } from "electron";
import { MainRootState } from "../reducers";
import { FilePathInfo } from "../../shared/types/FilePathInfo";
import { getAllFilePaths } from "../system/getAllFilePaths";
import { blinq } from "blinq";

const pathToShareDirectory = path.join(app.getPath("home"), ".pshare", "share");

export function* addFileSaga() {
    yield takeEvery(getType(AddFileActions.filesSelected), function* (action: ActionType<typeof AddFileActions.filesSelected>) {


        const { files, directories }: SortedFileInfoCollection = yield call(() => sortFileInfosToFileOrDirectories(action.payload))




        const linkedUserName: string | undefined = yield select((s: MainRootState) => s.sharedFiles.linkedUserName)
        if (!linkedUserName) {
            return
        }
        const baseDirectory = path.join(pathToShareDirectory, linkedUserName, "out");
        const currentPath = yield select((s: MainRootState) => s.fileNavigation.sharedFilesViewPath.join("/"))

        const targetDirectory = path.join(baseDirectory, currentPath)
        yield call(() => fsExtra.ensureDir(targetDirectory))

        yield* addDroppedFiles(files, targetDirectory)
        yield* addDroppedDirectories(directories, targetDirectory)
        yield put(AddFileActions.close())
    })
}

interface CopyOperation {
    src: string
    dest: string
}

function* addDroppedDirectories(filePathInfos: FilePathInfo[], targetDirectory: string) {
    const operations: CopyOperation[] = [];
    for (const folderInfo of filePathInfos) {
        const allFilePaths: string[] = yield call(() => getAllFilePaths([folderInfo.path]))
        const dirName = path.basename(folderInfo.path)
        const newDirectoryPath = path.join(targetDirectory, dirName)
        const exists: boolean = yield call(() => pathExists(newDirectoryPath))
        if (exists) {
            throw Error("pathExists")
        }
        const relativePaths = allFilePaths.map(p => ({ absolutePath: p, relativePath: path.join(dirName, path.relative(folderInfo.path, p)) }))
        const ops = relativePaths.map(({ absolutePath, relativePath }) => ({ src: absolutePath, dest: path.join(targetDirectory, relativePath) }))
        operations.push(...ops)
    }
    const directoriesToEnsure = blinq(operations).select(o => path.dirname(o.dest)).distinct().toArray();

    for (const dp of directoriesToEnsure) {
        yield call(() => fsExtra.ensureDir(dp))
    }

    for (const { src, dest } of operations) {
        yield call(() => fsExtra.copy(src, dest, { errorOnExist: true, overwrite: false }))
    }


}
async function pathExists(path: string): Promise<boolean> {
    try {
        await fs.promises.access(path)
    } catch{
        return false
    }
    return true
}
function* addDroppedFiles(filePathInfos: FilePathInfo[], targetDirectory: string) {
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
}

interface SortedFileInfoCollection {
    files: FilePathInfo[]
    directories: FilePathInfo[]
}

async function sortFileInfosToFileOrDirectories(fileInfos: FilePathInfo[]): Promise<SortedFileInfoCollection> {
    const files: FilePathInfo[] = []
    const directories: FilePathInfo[] = []
    for (const fileInfo of fileInfos) {
        const normalizedPath = path.normalize(fileInfo.path);
        const stat: fs.Stats = await fs.promises.stat(normalizedPath);
        if (stat.isDirectory()) {
            directories.push(fileInfo)
        } else if (stat.isFile()) {
            files.push(fileInfo)
        }
    }
    return { files, directories }

}