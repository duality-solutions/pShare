import { ActionType, createStandardAction } from 'typesafe-actions';
import { FilePathInfo } from '../../rtc/system/webRtc/FilePathInfo';




// ensure this is added to ./index.ts RootActions
export const FileActions = {


    filesSelected: createStandardAction('file/FILES_SELECTED')<FilePathInfo[]>(),
}

export type FileActions = ActionType<typeof FileActions>;

