import { watch } from 'chokidar'
import { eventChannel, END } from 'redux-saga';
import { app } from 'electron';
import * as path from 'path'
import * as fs from 'fs'
import * as util from 'util'
import { call, take, fork, cancelled } from 'redux-saga/effects';

interface FileWatchEvent {
    type: "add" | "change" | "unlink"
    path: string
}

const fsMkdirAsync = util.promisify(fs.mkdir)

export function* fileWatchSaga() {
    const pathToShareDirectory = path.join(app.getPath("home"), ".pshare", "share");
    try {
        yield call(() => fsMkdirAsync(pathToShareDirectory, { recursive: true }))
    } catch (err) {
        if (!/^EEXIST/.test(err.message)) {
            throw err
        }
    }
    const watcher = watch(pathToShareDirectory, { awaitWriteFinish: true })
    const channel = eventChannel((emitter: (v: FileWatchEvent | END) => void) => {
        const addHandler: (...args: any[]) => void = path => emitter({ type: "add", path });
        const changeHandler: (...args: any[]) => void = path => emitter({ type: "change", path });
        const unlinkHandler: (...args: any[]) => void = path => emitter({ type: "unlink", path });
        watcher.on("add", addHandler)
        watcher.on("change", changeHandler)
        watcher.on("unlink", unlinkHandler)
        return () => {
            console.log("killing watcher")
            watcher.off("add", addHandler)
            watcher.off("change", changeHandler)
            watcher.off("unlink", unlinkHandler)
        }
    })

    try {
        for (; ;) {
            const channelMessage = yield take(channel)
            yield fork(function () {
                console.log(channelMessage)
            })
        }
    } finally {
        if (yield cancelled()) {
            channel.close()
        }
    }


}