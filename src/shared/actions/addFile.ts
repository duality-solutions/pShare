import { ActionType, createStandardAction } from 'typesafe-actions';
import { FilePathInfo } from '../types/FilePathInfo';
export const AddFileActions = {
    close: createStandardAction('add_files/CLOSE')<void>(),
    filesSelected: createStandardAction('add_files/FILES_SELECTED')<FilePathInfo[]>(),
    showFileSelectDialog: createStandardAction('add_files/SHOW_FILE_SELECT_DIALOG')<"openFile" | "openDirectory">(),
};
export type AddFileActions = ActionType<typeof AddFileActions>;
