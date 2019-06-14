import { ActionType, createStandardAction } from 'typesafe-actions';
import { SharedFile } from '../types/SharedFile';
export const FileWatchActions = {
    fileAdded: createStandardAction('file_watch/FILE_ADDED')<SharedFile>(),
    fileUnlinked: createStandardAction('file_watch/FILE_UNLINKED')<SharedFile>(),
    initialScanComplete:createStandardAction('file_watch/INITIAL_SCAN_COMPLETE')<void>(),
};
export type FileWatchActions = ActionType<typeof FileWatchActions>;
