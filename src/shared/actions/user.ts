import { ActionType, createStandardAction } from 'typesafe-actions';

// ensure this is added to ./index.ts RootActions
export const UserActions = {
    userAgreeSync: createStandardAction('user/SYNC_AGREED')<void>(),
}

export type UserActions = ActionType<typeof UserActions>;


