import { ActionType, createStandardAction } from 'typesafe-actions';
import { FilePathInfo } from '../types/FilePathInfo';
export const AddFileActions = {
    close: createStandardAction('add_files/CLOSE')<void>(),
    filesSelected: createStandardAction('add_files/FILES_SELECTED')<FilePathInfo[]>(),
    //directoriesSelected: createStandardAction('add_files/DIRECTORIES_SELECTED')<string[]>(),
};
export type AddFileActions = ActionType<typeof AddFileActions>;
