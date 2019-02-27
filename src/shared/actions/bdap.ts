import { ActionType, createStandardAction } from 'typesafe-actions';
import { GetUserInfo } from '../../dynamicdInterfaces/GetUserInfo';
import { Link } from '../../dynamicdInterfaces/links/Link';
import { PendingLink } from '../../dynamicdInterfaces/links/PendingLink';
import { LinkRequestOptions } from './payloadTypes/LinkRequestOptions';
import { LinkAcceptOptions } from "./payloadTypes/LinkAcceptOptions";

export const BdapActions = {

    initialize: createStandardAction('bdap/INITIALIZE')<void>(),

    getUsers: createStandardAction('bdap/GET_USERS')<void>(),
    getUsersSuccess: createStandardAction('bdap/GET_USERS_SUCCESS')<GetUserInfo[]>(),
    getUsersFailed: createStandardAction('bdap/GET_USERS_FAILED')<string>(),

    getCompleteLinks: createStandardAction('bdap/GET_COMPLETE_LINKS')<void>(),
    getCompleteLinksSuccess: createStandardAction('bdap/GET_COMPLETE_LINKS_SUCCESS')<Link[]>(),
    getCompleteLinksFailed: createStandardAction('bdap/GET_COMPLETE_LINKS_FAILED')<string>(),


    getPendingRequestLinks: createStandardAction('bdap/GET_PENDING_REQUEST_LINKS')<void>(),
    getPendingRequestLinksSuccess: createStandardAction('bdap/GET_PENDING_REQUEST_LINKS_SUCCESS')<PendingLink[]>(),
    getPendingRequestLinksFailed: createStandardAction('bdap/GET_PENDING_REQUEST_LINKS_FAILED')<string>(),

    getPendingAcceptLinks: createStandardAction('bdap/GET_PENDING_ACCEPT_LINKS')<void>(),
    getPendingAcceptLinksSuccess: createStandardAction('bdap/GET_PENDING_ACCEPT_LINKS_SUCCESS')<PendingLink[]>(),
    getPendingAcceptLinksFailed: createStandardAction('bdap/GET_PENDING_ACCEPT_LINKS_FAILED')<string>(),

    currentUserReceived:createStandardAction('bdap/CURRENT_USER_RECEIVED')<GetUserInfo>(),

    createLinkRequest:createStandardAction('bdap/CREATE_LINK_REQUEST')<LinkRequestOptions>(),
    acceptLink:createStandardAction('bdap/ACCEPT_LINK')<LinkAcceptOptions>(),



}

export type BdapActions = ActionType<typeof BdapActions>;

