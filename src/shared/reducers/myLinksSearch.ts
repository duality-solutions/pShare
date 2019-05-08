import { SearchActions } from "../actions/search";
import { getType } from "typesafe-actions";

interface MyLinksSearchState {
    query: string
}

const defaultState: MyLinksSearchState = { query: "" }

export const myLinksSearch = (state: MyLinksSearchState = defaultState, action: SearchActions): MyLinksSearchState => {
    switch (action.type) {
        case getType(SearchActions.myLinksQueryChanged):
            return { ...state, query: action.payload }
        default:
            return state
    }
}

