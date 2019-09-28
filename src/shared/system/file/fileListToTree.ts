import { blinq, empty, range } from "blinq";
import { Enumerable } from "blinq/dist/types/src/Enumerable";
import { FileEntry } from "./FileEntry";
import { DirectoryEntry } from "./DirectoryEntry";
import { SharedFile } from "../../types/SharedFile";
import { DownloadableFile } from "../../types/DownloadableFile";
import * as path from "path"

function isSharedFile(item: SharedFile | DownloadableFile): item is SharedFile {
    return !!(item as SharedFile).direction
}
function isDownloadableFile(item: SharedFile | DownloadableFile): item is DownloadableFile {
    return !!(item as DownloadableFile).file
}

interface RawFileEntry<T extends SharedFile | DownloadableFile> {
    pathSegments: string[],
    file: T
}

/// takes a list of filepaths and turns them into an object hierarchy representing directories and files
export function fileListToTree<T extends SharedFile | DownloadableFile>(list: T[]): DirectoryEntry<T> {
    if (list.length === 0) {
        //throw {}
        return { entries: [], type: "directory" }
    }
    const bList = blinq(list);
    const v = bList.first()


    const fileSegmentsList = bList
        .select(file => {
            if (isSharedFile(file)) {
                if (file.relativePath.startsWith("/")) {
                    throw Error("paths should not start with '/'")
                }
                const v: RawFileEntry<T> = {
                    pathSegments: file.relativePath.split("/"),
                    file
                };
                return v
            } else if (isDownloadableFile(file)) {
                if (file.file.fileName.startsWith("/")) {
                    throw Error("paths should not start with '/'")
                }
                const v: RawFileEntry<T> = {
                    pathSegments: file.file.fileName.split("/"),
                    file
                };
                return v
            }
            throw Error("unexpected")
        });
    let baseDir: string | undefined
    if (isSharedFile(v)) {
        const depth = v.relativePath.split("/").length
        const backPaths = range(0, depth).select(x => "..").toArray().join("/")
        baseDir = path.normalize(path.join(v.path, backPaths))
        console.log("basedir is ", baseDir)
    }
    return fileSegmentsListToTree(undefined, fileSegmentsList, baseDir);
}

function fileSegmentsListToTree<T extends SharedFile | DownloadableFile>(
    name: string | undefined,
    list: Enumerable<RawFileEntry<T>>,
    baseDir: string | undefined
): DirectoryEntry<T> {
    const lookup = list.toLookup(file => file.pathSegments.length > 1);
    const files = lookup.get(false) || empty<RawFileEntry<T>>();
    const dirs = lookup.get(true) || empty<RawFileEntry<T>>();

    const fileEntries: Enumerable<FileEntry<T>> = files.select(
        f => ({ type: "file", name: f.pathSegments[0], fileInfo: f.file } as FileEntry<T>)
    );
    const dirEntries: Enumerable<DirectoryEntry<T>> = dirs
        .groupBy(d => d.pathSegments[0])
        .select(g =>
            fileSegmentsListToTree(g.key, g.select(({ pathSegments: [, ...pathSegments], ...remaining }) => ({ ...remaining, pathSegments })), baseDir ? path.join(baseDir, g.key) : undefined)
        );
    const entries = empty<FileEntry<T> | DirectoryEntry<T>>()
        .concat(dirEntries)
        .concat(fileEntries)
        .orderBy(({ name }) => name)
        .toArray();

    return name != null
        ? {
            name,
            type: "directory",
            entries,
            fullPath: baseDir
        }
        : {
            type: "directory",
            entries,
            fullPath: baseDir
        };
}

