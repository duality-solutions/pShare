import { SearchActions } from "../actions/search";
import { getType } from "typesafe-actions";
interface AddLinksSearchState {
    query: string;
}
const defaultState: AddLinksSearchState = { query: "" };
export const addLinksSearch = (state: AddLinksSearchState = defaultState, action: SearchActions): AddLinksSearchState => {
    switch (action.type) {
        case getType(SearchActions.addLinksQueryChanged):
            return { ...state, query: action.payload };
        default:
            return state;
    }
};
