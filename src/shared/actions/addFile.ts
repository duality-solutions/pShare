import { ActionType, createStandardAction } from 'typesafe-actions';
import { FilePathInfo } from '../types/FilePathInfo';
export const AddFileActions = {
    close: createStandardAction('add_files/CLOSE')<void>(),
    filesSelected: createStandardAction('add_files/FILES_SELECTED')<FilePathInfo[]>(),
    failed: createStandardAction('add_files/FAILED')<string>(),
};
export type AddFileActions = ActionType<typeof AddFileActions>;
