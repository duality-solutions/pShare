import { ActionType, createStandardAction } from 'typesafe-actions';
export const SearchActions = {
    myLinksQueryChanged: createStandardAction('search/MY_LINKS_QUERY_CHANGED')<string>(),
    addLinksQueryChanged: createStandardAction('search/MY_LINKS_QUERY_CHANGED')<string>(),
};
export type SearchActions = ActionType<typeof SearchActions>;
