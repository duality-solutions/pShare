import { ActionType, createStandardAction } from 'typesafe-actions';
import { PublicSharedFile } from '../types/PublicSharedFile';
import { FileListMessage } from '../types/FileListMessage';

export const FileListActions = {
    fileListFetchFailed: createStandardAction('file_list/FILE_LIST_FETCH_FAILED')<void>(),
    fileListFetchSuccess: createStandardAction('file_list/FILE_LIST_FETCH_SUCCESS')<PublicSharedFile[]>(),
    fileListPublished: createStandardAction('file_list/FILE_LIST_PUBLISHED')<void>(),

    fileListMessageFetchSuccess:createStandardAction('file_list/FILE_LIST_MESSAGE_FETCH_SUCCESS')<FileListMessage>(),
};
export type FileListActions = ActionType<typeof FileListActions>;
