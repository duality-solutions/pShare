import { ActionType, createStandardAction } from 'typesafe-actions';
import { createLocalStandardAction } from '../system/createLocalStandardAction';
export const SearchActions = {
    myLinksQueryTextChanged: createLocalStandardAction('search/MY_LINKS_QUERY_TEXT_CHANGED')<string>(),
    myLinksQueryChanged: createStandardAction('search/MY_LINKS_QUERY_CHANGED')<string>(),
    addLinksQueryTextChanged: createLocalStandardAction('search/ADD_LINKS_QUERY_TEXT_CHANGED')<string>(),
    addLinksQueryChanged: createStandardAction('search/ADD_LINKS_QUERY_CHANGED')<string>(),
};
export type SearchActions = ActionType<typeof SearchActions>;
