import { ActionType, createStandardAction } from 'typesafe-actions';
import { PublicSharedFile } from '../types/PublicSharedFile';
export const FileListActions = {
    fileListFetchFailed: createStandardAction('file_list/FILE_LIST_FETCH_FAILED')<void>(),
    fileListFetchSuccess: createStandardAction('file_list/FILE_LIST_FETCH_SUCCESS')<PublicSharedFile[]>(),
    fileListPublished: createStandardAction('file_list/FILE_LIST_PUBLISHED')<void>(),
};
export type FileListActions = ActionType<typeof FileListActions>;
