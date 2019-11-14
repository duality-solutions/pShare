import { ActionType, createStandardAction } from "typesafe-actions";
import { SharedFile } from "../types/SharedFile";
export interface FileChange {
    file: SharedFile;
    type: "added" | "unlinked";
}
export const FileWatchActions = {
    fileAdded: createStandardAction("file_watch/FILE_ADDED")<SharedFile>(),
    fileUnlinked: createStandardAction("file_watch/FILE_UNLINKED")<
        SharedFile
    >(),
    filesChanged: createStandardAction("file_watch/FILES_CHANGED")<
        FileChange[]
    >(),
    initialScanComplete: createStandardAction(
        "file_watch/INITIAL_SCAN_COMPLETE"
    )<void>(),
};
export type FileWatchActions = ActionType<typeof FileWatchActions>;
