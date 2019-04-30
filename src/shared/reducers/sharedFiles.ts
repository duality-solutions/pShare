import { DashboardActions } from "../actions/dashboard";
import { getType } from "typesafe-actions";
import { SharedFilesActions } from "../actions/sharedFiles";

export interface SharedFilesState {
    linkedUserName?: string,
    linkedCommonName?: string
}

const defaultState: SharedFilesState = {
}

export const sharedFiles = (state: SharedFilesState = defaultState, action: DashboardActions | SharedFilesActions): SharedFilesState => {
    switch (action.type) {
        case getType(DashboardActions.viewSharedFiles):
            return { ...state, linkedUserName: action.payload.object_id, linkedCommonName: action.payload.common_name }
        case getType(SharedFilesActions.close):
            const { linkedUserName, ...rest } = state
            return rest
        default:
            return state
    }
}