import { ActionType, createStandardAction } from 'typesafe-actions';


const UserActions = {
    userAgreeSync: createStandardAction('user/SYNC_AGREED')<void>(),
}

type UserActions = ActionType<typeof UserActions>;

// ensure this is added to ./index.ts RootActions
export default UserActions