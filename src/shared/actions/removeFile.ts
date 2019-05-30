import { ActionType, createStandardAction } from 'typesafe-actions';
// import { FilePathInfo } from '../types/FilePathInfo';

export const RemoveFileActions = {
    removeSharedFile: createStandardAction('remove_file/REMOVE_SHARED_FILE')<string>(),
    fileRemoved: createStandardAction('remove_file/SHARED_FILE_REMOVED')<void>(),
};
export type RemoveFileActions = ActionType<typeof RemoveFileActions>;
