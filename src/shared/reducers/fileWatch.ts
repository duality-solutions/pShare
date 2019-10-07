import { FileWatchActions, FileChange } from "../actions/fileWatch";
import { SharedFile } from "../types/SharedFile";
import { getType } from "typesafe-actions";
import { deleteOptionalProperty } from "../system/deleteOptionalProperty";
import { blinq } from "blinq";
import { entries, keys } from "../system/entries";
import { tuple } from "../system/tuple";
import { Enumerable } from "blinq/dist/types/src/Enumerable";
import { deleteProperty } from "../system/deleteProperty";

export interface InOutSharedFiles {
    in: Record<string, SharedFile>;
    out: Record<string, SharedFile>;
}

interface FileWatchState {
    users: Record<string, InOutSharedFiles>;
}

const defaultState: FileWatchState = {
    users: {},
};

// todo: this is nasty. some sort of functional lense might be a way to tidy this up. shades.js is a possible candidate
export const fileWatch = (
    state: FileWatchState = defaultState,
    action: FileWatchActions
) => {
    switch (action.type) {
        case getType(FileWatchActions.filesChanged):
            const allChanges = blinq(action.payload);

            //const changesByUser = allChanges.groupBy(c => c.file.sharedWith);
            const users: Record<string, InOutSharedFiles> = entries(state.users)
                .fullOuterGroupJoin(
                    allChanges,
                    ([userKey]) => userKey,
                    c => c.file.sharedWith,
                    (userEntries, changes) =>
                        tuple(userEntries.singleOrDefault(), changes)
                )
                .select(([userEntry, changes]) =>
                    applyChanges(userEntry, changes)
                )
                .where(([, files]) => files != null)
                .aggregate({}, (users, [userKey, files]) => ({
                    ...users,
                    [userKey]: files!,
                }));
            return { users };

        case getType(FileWatchActions.fileAdded):
            return {
                ...state,
                users: {
                    ...state.users,
                    [action.payload.sharedWith]: {
                        ...state.users[action.payload.sharedWith],
                        in:
                            action.payload.direction !== "in"
                                ? (state.users[action.payload.sharedWith] || {})
                                      .in
                                : {
                                      ...(
                                          state.users[
                                              action.payload.sharedWith
                                          ] || {}
                                      ).in,
                                      [action.payload.relativePath]:
                                          action.payload,
                                  },
                        out:
                            action.payload.direction !== "out"
                                ? (state.users[action.payload.sharedWith] || {})
                                      .out
                                : {
                                      ...(
                                          state.users[
                                              action.payload.sharedWith
                                          ] || {}
                                      ).out,
                                      [action.payload.relativePath]:
                                          action.payload,
                                  },
                    },
                },
            };
        case getType(FileWatchActions.fileUnlinked):
            return {
                ...state,
                users: {
                    ...state.users,
                    [action.payload.sharedWith]: {
                        ...state.users[action.payload.sharedWith],
                        in:
                            action.payload.direction !== "in"
                                ? (state.users[action.payload.sharedWith] || {})
                                      .in
                                : deleteOptionalProperty(
                                      (
                                          state.users[
                                              action.payload.sharedWith
                                          ] || {}
                                      ).in || {},
                                      action.payload.relativePath
                                  ),
                        out:
                            action.payload.direction !== "out"
                                ? (state.users[action.payload.sharedWith] || {})
                                      .out
                                : deleteOptionalProperty(
                                      (
                                          state.users[
                                              action.payload.sharedWith
                                          ] || {}
                                      ).out || {},
                                      action.payload.relativePath
                                  ),
                    },
                },
            };
        default:
            return state;
    }
};

function applyChanges(
    userEntry: [string, InOutSharedFiles] | undefined,
    changes: Enumerable<FileChange>
): [string, InOutSharedFiles | null] {
    const firstChange = changes.firstOrDefault();
    if (!firstChange) {
        if (userEntry == null) {
            throw Error("userEntry should not be null");
        }
        return userEntry;
    }
    const [userKey, sharedFiles]: [string, InOutSharedFiles] =
        userEntry || tuple(firstChange.file.sharedWith, { in: {}, out: {} });

    const changesByInAndOut = changes.toLookup(c => c.file.direction);

    const returnEntries: InOutSharedFiles = blinq([
        {
            direction: "in",
            files: sharedFiles.in,
            changes: changesByInAndOut.get("in"),
        },
        {
            direction: "out",
            files: sharedFiles.out,
            changes: changesByInAndOut.get("out"),
        },
    ])
        .select(c =>
            tuple(
                c.direction,
                c.changes ? applyChanges2(c.files, c.changes) : c.files
            )
        )
        .aggregate({} as InOutSharedFiles, (o, [k, v]) => ({ ...o, [k]: v }));
    return tuple(
        userKey,
        keys(returnEntries.in).any() || keys(returnEntries.out).any()
            ? returnEntries
            : null
    );
}

function applyChanges2(
    files: Record<string, SharedFile>,
    changes: Iterable<FileChange>
): Record<string, SharedFile> {
    const updatedFiles = blinq(changes).aggregate(files, (files, change) =>
        change.type === "added"
            ? { ...files, [change.file.relativePath]: change.file }
            : change.type === "unlinked"
            ? deleteProperty(files, change.file.relativePath)
            : files
    );
    return updatedFiles;
}
