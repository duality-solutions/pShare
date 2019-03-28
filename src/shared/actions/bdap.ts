import { ActionType, createStandardAction } from 'typesafe-actions';
import { GetUserInfo } from '../../dynamicdInterfaces/GetUserInfo';
import { Link } from '../../dynamicdInterfaces/links/Link';
import { PendingLink } from '../../dynamicdInterfaces/links/PendingLink';
import { LinkRequestOptions } from './payloadTypes/LinkRequestOptions';
import { LinkAcceptOptions } from "./payloadTypes/LinkAcceptOptions";
import { LinkBase } from './payloadTypes/LinkBase';

export const BdapActions = {

    initialize: createStandardAction('bdap/INITIALIZE')<void>(),

    getUsers: createStandardAction('bdap/GET_USERS')<void>(),
    getUsersSuccess: createStandardAction('bdap/GET_USERS_SUCCESS')<GetUserInfo[]>(),
    getUsersFailed: createStandardAction('bdap/GET_USERS_FAILED')<string>(),

    getCompleteLinks: createStandardAction('bdap/GET_COMPLETE_LINKS')<void>(),
    getCompleteLinksSuccess: createStandardAction('bdap/GET_COMPLETE_LINKS_SUCCESS')<Link[]>(),
    getCompleteLinksFailed: createStandardAction('bdap/GET_COMPLETE_LINKS_FAILED')<string>(),

    completeLinkCreated:createStandardAction('bdap/COMPLETE_LINK_CREATED')<Link>(),
    completeLinkRemoved:createStandardAction('bdap/COMPLETE_LINK_REMOVED')<Link>(),



    getPendingRequestLinks: createStandardAction('bdap/GET_PENDING_REQUEST_LINKS')<void>(),
    getPendingRequestLinksSuccess: createStandardAction('bdap/GET_PENDING_REQUEST_LINKS_SUCCESS')<PendingLink[]>(),
    getPendingRequestLinksFailed: createStandardAction('bdap/GET_PENDING_REQUEST_LINKS_FAILED')<string>(),

    getPendingAcceptLinks: createStandardAction('bdap/GET_PENDING_ACCEPT_LINKS')<void>(),
    getPendingAcceptLinksSuccess: createStandardAction('bdap/GET_PENDING_ACCEPT_LINKS_SUCCESS')<PendingLink[]>(),
    getPendingAcceptLinksFailed: createStandardAction('bdap/GET_PENDING_ACCEPT_LINKS_FAILED')<string>(),
    
    
    bdapDataFetchSuccess: createStandardAction('bdap/BDAP_DATA_FETCH_SUCCESS')<void>(),
    bdapDataFetchFailed: createStandardAction('bdap/BDAP_DATA_FETCH_FAILED')<string>(),

    currentUserReceived: createStandardAction('bdap/CURRENT_USER_RECEIVED')<GetUserInfo>(),

    beginCreateLinkRequest: createStandardAction('bdap/BEGIN_CREATE_LINK_REQUEST')<LinkBase>(),
    createLinkRequest: createStandardAction('bdap/CREATE_LINK_REQUEST')<LinkRequestOptions>(),
    createLinkRequestFailed: createStandardAction('bdap/CREATE_LINK_REQUEST_FAILED')<string>(),

    beginAcceptLink: createStandardAction('bdap/BEGIN_ACCEPT_LINK')<LinkBase>(),
    acceptLink: createStandardAction('bdap/ACCEPT_LINK')<LinkAcceptOptions>(),



}

export type BdapActions = ActionType<typeof BdapActions>;

