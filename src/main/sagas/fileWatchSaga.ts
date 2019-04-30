import { watch } from 'chokidar'
import { eventChannel, END } from 'redux-saga';
import { app } from 'electron';
import * as path from 'path'
import * as fs from 'fs'
import * as util from 'util'
import * as fsExtra from 'fs-extra'
import { call, take, cancelled, fork, put } from 'redux-saga/effects';
import { createAsyncQueue } from '../../shared/system/createAsyncQueue';
import { BdapActions } from '../../shared/actions/bdap';
import mime from 'mime-types'
import { blinq } from 'blinq';
import { FileWatchActions } from "../../shared/actions/fileWatch";
import { SharedFile } from '../../shared/types/SharedFile';
interface SimpleFileWatchEvent {
    type: "add" | "change" | "unlink" | "ready"
}
interface FileWatchEvent extends SimpleFileWatchEvent {
    path: string
}
const fsStatAsync = util.promisify(fs.stat)
//const isDirectory = (obj: DirectoryEntry): obj is Directory => obj.type === "directory"
const isFileWatchEvent = (obj: SimpleFileWatchEvent): obj is FileWatchEvent => (<FileWatchEvent>obj).path !== undefined
const pathToShareDirectory = path.join(app.getPath("home"), ".pshare", "share");
const getRelativePath = (fqPath: string) => path.relative(pathToShareDirectory, fqPath)
export function* fileWatchSaga() {
    yield take(BdapActions.bdapDataFetchSuccess)
    yield call(() => fsExtra.ensureDir(pathToShareDirectory))
    console.log("starting file watcher")
    const watcher = watch(pathToShareDirectory, { awaitWriteFinish: false })
    const channel = eventChannel((emitter: (v: SimpleFileWatchEvent | FileWatchEvent | END) => void) => {
        const addHandler: (...args: any[]) => void = path => emitter({ type: "add", path });
        const changeHandler: (...args: any[]) => void = path => emitter({ type: "change", path });
        const unlinkHandler: (...args: any[]) => void = path => emitter({ type: "unlink", path });
        const readyHandler: (...args: any[]) => void = () => emitter({ type: "ready" });
        watcher.on("add", addHandler)
        watcher.on("change", changeHandler)
        watcher.on("unlink", unlinkHandler)
        watcher.on("ready", readyHandler)
        return () => {
            console.log("killing watcher")
            watcher.off("add", addHandler)
            watcher.off("change", changeHandler)
            watcher.off("unlink", unlinkHandler)
            watcher.off("ready", readyHandler)
        }
    })
    const q = createAsyncQueue<SimpleFileWatchEvent>()
    yield fork(function* () {
        try {
            for (; ;) {
                const ev: SimpleFileWatchEvent = yield take(channel)
                q.post(ev)
            }
        } finally {
            if (yield cancelled()) {
                channel.close()
            }
        }
    })
    //const addedFiles: string[] = []
    //const unlinkedFiles: string[] = []
    for (; ;) {
        const ev: SimpleFileWatchEvent = yield call(() => q.receive())
        // if (ev.type === "ready") {
        //     break;
        // }
        if (isFileWatchEvent(ev)) {
            switch (ev.type) {
                case "add":
                    {
                        const files: SharedFile[] = yield* getSharedFileInfo([ev.path], true);
                        for (const f of files) {
                            yield put(FileWatchActions.fileAdded(f))
                        }
                        break
                    }
                case "unlink":
                    {
                        const files: SharedFile[] = yield* getSharedFileInfo([ev.path], false);
                        for (const f of files) {
                            yield put(FileWatchActions.fileUnlinked(f))
                        }
                        break
                    }
            }
        }
    }
    // const allFiles = blinq(addedFiles)
    //     .except(unlinkedFiles);
    // const files: SharedFile[] = yield* getSharedFileInfo(allFiles);

    // for (const f of files) {
    //     yield put(FileWatchActions.fileAdded(f))
    // }
    // //console.log(initialFiles)
    // console.log(files)

}

const getTopDirectoryFromPath = (filePath: string) => {
    const pathSegments = filePath.split(path.sep);
    return pathSegments.length <= 1 ? undefined : pathSegments[0];
}
function* getSharedFileInfo(allFiles: Iterable<string>, gatherMetaData: boolean) {
    const filePromises: Iterable<Promise<SharedFile>> =
        blinq(allFiles)
            .selectMany(filePath => {
                const relPath = getRelativePath(filePath);
                const userDirName = getTopDirectoryFromPath(relPath); //represents linked user
                if (!userDirName) {
                    return [];
                }
                const userDirRelativePath = path.relative(userDirName, relPath);
                const inOrOut = getTopDirectoryFromPath(userDirRelativePath)
                if (inOrOut !== "in" && inOrOut !== "out") {
                    return []
                }
                const dir: "in" | "out" = inOrOut
                const inOutRelPath = path.relative(inOrOut, userDirRelativePath)
                return [{
                    direction: dir,
                    filePath,
                    userDirName,
                    inOutRelPath
                }];
            })
            .select(async (fi): Promise<SharedFile> => {
                let stats: fs.Stats | undefined;
                let contentType: string | undefined
                if (gatherMetaData) {
                    stats = await fsStatAsync(fi.filePath);
                    contentType = mime.lookup(fi.filePath) || 'application/octet-stream'
                };
                return ({
                    path: fi.filePath,
                    contentType,
                    relativePath: fi.inOutRelPath,
                    direction: fi.direction,
                    size: stats ? stats.size : undefined,
                    sharedWith: fi.userDirName
                });
            });
    const files: SharedFile[] = [];
    for (let filePromise of filePromises) {
        const f: SharedFile = yield call(() => filePromise);
        files.push(f);
    }
    return files;
}

