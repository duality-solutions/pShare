import { SearchActions } from "../actions/search";
import { getType } from "typesafe-actions";

interface MyLinksSearchState {
    queryText: string
    query: string
}

const defaultState: MyLinksSearchState = { queryText: "", query: "" }

export const myLinksSearch = (state: MyLinksSearchState = defaultState, action: SearchActions): MyLinksSearchState => {
    switch (action.type) {
        case getType(SearchActions.myLinksQueryTextChanged):
            return { ...state, queryText: action.payload }
        case getType(SearchActions.myLinksQueryChanged):
            return { ...state, query: action.payload }
        default:
            return state
    }
}

