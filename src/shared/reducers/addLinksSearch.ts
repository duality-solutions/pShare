import { SearchActions } from "../actions/search";
import { getType } from "typesafe-actions";
interface AddLinksSearchState {
    queryText: string;
    query: string
}
const defaultState: AddLinksSearchState = { queryText: "", query: "" };
export const addLinksSearch = (state: AddLinksSearchState = defaultState, action: SearchActions): AddLinksSearchState => {
    switch (action.type) {
        case getType(SearchActions.addLinksQueryTextChanged):
            return { ...state, queryText: action.payload };
        case getType(SearchActions.addLinksQueryChanged):
            return { ...state, query: action.payload };
        default:
            return state;
    }
};
