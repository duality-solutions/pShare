import { ActionType, createStandardAction } from 'typesafe-actions';
export const BdapActions = {

    someAction: createStandardAction('bdap/SOME_ACTION')<void>(),

 

}

export type BdapActions = ActionType<typeof BdapActions>;

