import { ActionType, createStandardAction } from 'typesafe-actions';


const UserActions = {
    userAgreeSync: createStandardAction('user/SYNC_AGREED')<void>(),
}

type UserActions = ActionType<typeof UserActions>;

export default UserActions