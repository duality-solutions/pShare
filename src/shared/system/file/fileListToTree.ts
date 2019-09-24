import { blinq, empty } from "blinq";
import { Enumerable } from "blinq/dist/types/src/Enumerable";
import { FileEntry } from "./FileEntry";
import { DirectoryEntry } from "./DirectoryEntry";

/// takes a list of filepaths and turns them into an object hierarchy representing directories and files
export function fileListToTree(list: string[]): DirectoryEntry {
    const fileSegmentsList = blinq(list)
        .select(list => list.split("/"));

    return fileSegmentsListToTree(undefined, fileSegmentsList);
}

function fileSegmentsListToTree(
    name: string | undefined,
    list: Enumerable<string[]>
): DirectoryEntry {
    const lookup = list.toLookup(segs => segs.length > 1);
    const files = lookup.get(false) || empty<string[]>();
    const dirs = lookup.get(true) || empty<string[]>();

    const fileEntries: Enumerable<FileEntry> = files.select(
        f => ({ type: "file", name: f[0] } as FileEntry)
    );
    const dirEntries: Enumerable<DirectoryEntry> = dirs
        .groupBy(d => d[0])
        .select(g =>
            fileSegmentsListToTree(g.key, g.select(([, ...rest]) => rest))
        );
    const entries = empty<FileEntry | DirectoryEntry>()
        .concat(dirEntries)
        .concat(fileEntries)
        .orderBy(({ name }) => name)
        .toArray();

    return name != null
        ? {
            name: `${name}/`,
            type: "directory",
            entries
        }
        : {
            type: "directory",
            entries
        };
}

