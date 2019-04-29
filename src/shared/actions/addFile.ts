import { ActionType, createStandardAction } from 'typesafe-actions';
export const AddFileActions = {
    close: createStandardAction('add_files/CLOSE')<void>(),
};
export type AddFileActions = ActionType<typeof AddFileActions>;
