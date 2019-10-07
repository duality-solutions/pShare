import { watch } from "chokidar";
import { eventChannel, END, buffers } from "redux-saga";
import { app } from "electron";
import os from "os";
import * as path from "path";
import * as fs from "fs";
import * as util from "util";
import * as fsExtra from "fs-extra";
import { call, take, put } from "redux-saga/effects";
import { BdapActions } from "../../shared/actions/bdap";
import mime from "mime-types";
import { blinq } from "blinq";
import { FileWatchActions, FileChange } from "../../shared/actions/fileWatch";
import { SharedFile } from "../../shared/types/SharedFile";
//import { maximumFileSize } from '../../shared/system/maximumFileSize';
//import { hashFile } from '../../shared/system/hashing/hashFile';
import { getType } from "typesafe-actions";
import { resourceScope } from "../../shared/system/redux-saga/resourceScope";
import { takeBatch } from "../../shared/system/redux-saga/takeBatch";
interface SimpleFileWatchEvent {
    type: "add" | "change" | "unlink" | "ready";
}
interface FileWatchEvent extends SimpleFileWatchEvent {
    path: string;
}
const fsStatAsync = util.promisify(fs.stat);
//const isDirectory = (obj: DirectoryEntry): obj is Directory => obj.type === "directory"
const isFileWatchEvent = (obj: SimpleFileWatchEvent): obj is FileWatchEvent =>
    (<FileWatchEvent>obj).path !== undefined;
const pathToShareDirectory = path.join(app.getPath("home"), ".pshare", "share");
const getRelativePath = (fqPath: string) =>
    path.relative(pathToShareDirectory, fqPath);
export function* fileWatchSaga() {
    yield take(getType(BdapActions.bdapDataFetchSuccess));
    yield call(() => fsExtra.ensureDir(pathToShareDirectory));
    console.log("starting file watcher");
    const watcher = watch(pathToShareDirectory, {
        awaitWriteFinish: { stabilityThreshold: 500 },
    });
    const channel = eventChannel(
        (emitter: (v: SimpleFileWatchEvent | FileWatchEvent | END) => void) => {
            const addHandler: (...args: any[]) => void = path =>
                emitter({ type: "add", path });
            const changeHandler: (...args: any[]) => void = path =>
                emitter({ type: "change", path });
            const unlinkHandler: (...args: any[]) => void = path =>
                emitter({ type: "unlink", path });
            const readyHandler: (...args: any[]) => void = () =>
                emitter({ type: "ready" });
            watcher.on("add", addHandler);
            watcher.on("change", changeHandler);
            watcher.on("unlink", unlinkHandler);
            watcher.on("ready", readyHandler);
            return () => {
                console.log("killing watcher");
                watcher.off("add", addHandler);
                watcher.off("change", changeHandler);
                watcher.off("unlink", unlinkHandler);
                watcher.off("ready", readyHandler);
            };
        },
        buffers.expanding()
    );
    const scope = resourceScope(channel, ch => ch.close());

    yield* scope.use(function*(channel) {
        for (;;) {
            const receivedEvts = yield takeBatch(channel, {
                maxDurationMs: 10000,
                maxSize: 4096,
                minDurationMs: 1000,
            });
            console.log(`got ${receivedEvts.length} filewatch events`);
            const fileChanges: FileChange[] = [];

            for (const ev of receivedEvts) {
                if (ev.type === "ready") {
                    yield put(FileWatchActions.initialScanComplete());
                    continue;
                }

                if (isFileWatchEvent(ev)) {
                    switch (ev.type) {
                        case "add": {
                            const files: SharedFile[] = yield* getSharedFileInfo(
                                [ev.path],
                                true
                            );

                            for (const f of files) {
                                // if (f.size === undefined || f.size > maximumFileSize) {
                                //     continue
                                // }

                                fileChanges.push({ type: "added", file: f });
                            }
                            break;
                        }

                        case "unlink": {
                            const files: SharedFile[] = yield* getSharedFileInfo(
                                [ev.path],
                                false
                            );
                            for (const f of files) {
                                fileChanges.push({ type: "unlinked", file: f });
                            }
                            break;
                        }
                    }
                }
            }
            yield put(FileWatchActions.filesChanged(fileChanges));
        }
    });
}

const getTopDirectoryFromPath = (filePath: string) => {
    const pathSegments = filePath.split(path.sep);
    return pathSegments.length <= 1 ? undefined : pathSegments[0];
};
function* getSharedFileInfo(
    allFiles: Iterable<string>,
    gatherMetaData: boolean
) {
    const filePromises: Iterable<Promise<SharedFile>> = blinq(allFiles)
        .selectMany(filePath => {
            const relPath = getRelativePath(filePath);
            const userDirName = getTopDirectoryFromPath(relPath); //represents linked user
            if (!userDirName) {
                return [];
            }
            const userDirRelativePath = path.relative(userDirName, relPath);
            const inOrOut = getTopDirectoryFromPath(userDirRelativePath);
            if (inOrOut !== "in" && inOrOut !== "out") {
                return [];
            }
            const dir: "in" | "out" = inOrOut;
            const inOutRelPath = path.relative(inOrOut, userDirRelativePath);
            return [
                {
                    direction: dir,
                    filePath,
                    userDirName,
                    inOutRelPath,
                },
            ];
        })
        .select(
            async (fi): Promise<SharedFile> => {
                let stats: fs.Stats | undefined;
                let contentType: string | undefined;
                //let hash: string | undefined

                if (gatherMetaData) {
                    stats = await fsStatAsync(fi.filePath);
                    contentType =
                        mime.lookup(fi.filePath) || "application/octet-stream";
                    //hash = await hashFile(fi.filePath)
                }
                return {
                    path: fi.filePath,
                    contentType,
                    relativePath: normalizeSlashes(fi.inOutRelPath),
                    direction: fi.direction,
                    size: stats ? stats.size : undefined,
                    sharedWith: fi.userDirName,
                    //hash
                };
            }
        );
    const files: SharedFile[] = [];
    for (let filePromise of filePromises) {
        const f: SharedFile = yield call(() => filePromise);
        files.push(f);
    }
    return files;
}

const normalizeSlashes = (p: string) =>
    os.platform() === "win32" ? p.replace(/\\/g, "/") : p;
