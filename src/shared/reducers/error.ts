import { RootActions } from "../actions";
import { getType } from "typesafe-actions";

interface ErrorState {
    error?: any
}

export const error = (state: ErrorState = {}, action: RootActions): ErrorState => {
    switch (action.type) {
        case getType(RootActions.sagaError): {
            return { ...state, error: action.payload }
        }
    }
    return state
}
