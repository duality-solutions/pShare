import { ActionType, createStandardAction } from 'typesafe-actions';
import { GetUsersEntry } from '../../dynamicdInterfaces/getusers/GetUsersEntry';
import { LinkRequestEntry } from '../../dynamicdInterfaces/links/LinkRequestEntry';

export const BdapActions = {

    getUsers: createStandardAction('bdap/GET_USERS')<void>(),
    getUsersSuccess: createStandardAction('bdap/GET_USERS_SUCCESS')<GetUsersEntry[]>(),
    getUsersFailed: createStandardAction('bdap/GET_USERS_FAILED')<string>(),

    getCompleteLinks: createStandardAction('bdap/GET_COMPLETE_LINKS')<void>(),
    getCompleteLinksSuccess: createStandardAction('bdap/GET_COMPLETE_LINKS_SUCCESS')<LinkRequestEntry[]>(),
    getCompleteLinksFailed: createStandardAction('bdap/GET_COMPLETE_LINKS_FAILED')<string>(),


    getPendingLinks: createStandardAction('bdap/GET_PENDING_LINKS')<void>(),
    getPendingLinksSuccess: createStandardAction('bdap/GET_PENDING_LINKS_SUCCESS')<LinkRequestEntry[]>(),
    getPendingLinksFailed: createStandardAction('bdap/GET_PENDING_LINKS_FAILED')<string>(),

}

export type BdapActions = ActionType<typeof BdapActions>;

