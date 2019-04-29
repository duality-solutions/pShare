import { ActionType, createStandardAction } from 'typesafe-actions';

// ensure this is added to ./index.ts RootActions
export const SharedFilesActions = {
    close: createStandardAction('shared_files/CLOSE')<void>(),
    shareNewFile: createStandardAction('shared_files/SHARE_NEW_FILE')<void>(),
}

export type SharedFilesActions = ActionType<typeof SharedFilesActions>;
