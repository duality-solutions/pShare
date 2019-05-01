import { DashboardActions } from "../actions/dashboard";
import { getType } from "typesafe-actions";
import { SharedFilesActions } from "../actions/sharedFiles";
import { FileListActions } from "../actions/fileList";
import { PublicSharedFile } from "../types/PublicSharedFile";
import { deleteOptionalProperty } from "../system/deleteOptionalProperty";

export interface SharedFilesState {
    linkedUserName?: string,
    linkedCommonName?: string,
    downloadableFiles?: PublicSharedFile[]
}

const defaultState: SharedFilesState = {
}

export const sharedFiles = (state: SharedFilesState = defaultState, action: DashboardActions | SharedFilesActions | FileListActions): SharedFilesState => {
    switch (action.type) {
        case getType(DashboardActions.viewSharedFiles):
            return { ...state, linkedUserName: action.payload.object_id, linkedCommonName: action.payload.common_name }
        case getType(FileListActions.fileListFetchSuccess):
            return { ...state, downloadableFiles: action.payload }
        case getType(FileListActions.fileListFetchFailed):
            return deleteOptionalProperty(state, "downloadableFiles")
        case getType(SharedFilesActions.close):
            const { linkedUserName, ...rest } = state
            return rest
        default:
            return state
    }
}