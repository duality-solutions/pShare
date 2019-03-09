import { ActionType, createStandardAction } from 'typesafe-actions';
import { FileInfo } from '../../renderer/components/RtcPlayground/Dropzone';




// ensure this is added to ./index.ts RootActions
export const FileActions = {


    filesSelected: createStandardAction('file/FILES_SELECTED')<FileInfo[]>(),
}

export type FileActions = ActionType<typeof FileActions>;

