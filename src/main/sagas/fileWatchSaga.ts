import { watch } from 'chokidar'
import { eventChannel, END } from 'redux-saga';
import { app } from 'electron';
import * as path from 'path'
import * as fs from 'fs'
import * as util from 'util'
import { call, take, cancelled, fork } from 'redux-saga/effects';
import { createAsyncQueue } from '../../shared/system/createAsyncQueue';
import { BdapActions } from '../../shared/actions/bdap';
import mime from 'mime-types'
import { blinq } from 'blinq';
interface SimpleFileWatchEvent {
    type: "add" | "change" | "unlink" | "ready"
}
interface FileWatchEvent extends SimpleFileWatchEvent {
    path: string
}
interface File {
    sharedWith: string
    userDirRelativePath: string
    path: string
    size: number
    contentType: string
}
const fsMkdirAsync = util.promisify(fs.mkdir)
const fsStatAsync = util.promisify(fs.stat)
//const isDirectory = (obj: DirectoryEntry): obj is Directory => obj.type === "directory"
const isFileWatchEvent = (obj: SimpleFileWatchEvent): obj is FileWatchEvent => (<FileWatchEvent>obj).path !== undefined
const pathToShareDirectory = path.join(app.getPath("home"), ".pshare", "share");
const getRelativePath = (fqPath: string) => path.relative(pathToShareDirectory, fqPath)
export function* fileWatchSaga() {
    yield take(BdapActions.bdapDataFetchSuccess)
    try {
        yield call(() => fsMkdirAsync(pathToShareDirectory, { recursive: true }))
    } catch (err) {
        if (!/^EEXIST/.test(err.message)) {
            throw err
        }
    }
    const watcher = watch(pathToShareDirectory, { awaitWriteFinish: true })
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
    const addedFiles: string[] = []
    const unlinkedFiles: string[] = []
    const getTopDirectoryFromPath = (filePath: string) => {
        const pathSegments = filePath.split(path.sep);
        return pathSegments.length <= 1 ? undefined : pathSegments[0];
    }
    for (; ;) {
        const ev: SimpleFileWatchEvent = yield call(() => q.receive())
        if (ev.type === "ready") {
            break;
        }
        if (isFileWatchEvent(ev)) {
            switch (ev.type) {
                case "add":
                    addedFiles.push(ev.path)
                    break
                case "unlink":
                    unlinkedFiles.push(ev.path)
                    break
            }
        }
    }
    const filePromises: Iterable<Promise<File>> = blinq(addedFiles)
        .except(unlinkedFiles)
        .selectMany(filePath => {
            const relPath = getRelativePath(filePath);
            const userDirName = getTopDirectoryFromPath(relPath); //represents linked user
            if (!userDirName) {
                return [];
            }
            const userDirRelativePath = path.relative(userDirName, relPath);
            return [{
                filePath,
                userDirName,
                userDirRelativePath
            }];
        })
        .select(async (fi): Promise<File> => {
            const stats = await fsStatAsync(fi.filePath)
            const contentType = mime.lookup(fi.filePath) || 'application/octet-stream';
            return ({
                path: fi.filePath,
                contentType,
                userDirRelativePath: fi.userDirRelativePath,
                size: stats.size,
                sharedWith: fi.userDirName
            });
        });

    const files: File[] = []
    for (let filePromise of filePromises) {
        const f: File = yield call(() => filePromise)
        files.push(f)
    }
    //console.log(initialFiles)
    console.log(files)

}