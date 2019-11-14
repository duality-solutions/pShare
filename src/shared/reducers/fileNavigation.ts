import { RootActions } from "../actions";
import { getType } from "typesafe-actions";

interface FileNavigationState {
    sharedFilesViewPath: string[]
    downloadableFilesViewPath: string[]
}

const defaultState = { downloadableFilesViewPath: [], sharedFilesViewPath: [] };
export const fileNavigation = (state: FileNavigationState = defaultState, action: RootActions): FileNavigationState => {
    switch (action.type) {
        case getType(RootActions.openDirectory): {
            switch (action.payload.type) {
                case "sharedFiles":
                    return { ...state, sharedFilesViewPath: [...state.sharedFilesViewPath, action.payload.location] }
                case "downloadableFiles":
                    return { ...state, downloadableFilesViewPath: [...state.downloadableFilesViewPath, action.payload.location] }
                default:
                    return state
            }
        }
        case getType(RootActions.upDirectory): {
            switch (action.payload.type) {
                case "sharedFiles":
                    return { ...state, sharedFilesViewPath: state.sharedFilesViewPath.slice(0, -1) }
                case "downloadableFiles":
                    return { ...state, downloadableFilesViewPath: state.downloadableFilesViewPath.slice(0, -1) }
                default:
                    return state
            }
        }
        case getType(RootActions.goRoot): {
            switch (action.payload.type) {
                case "sharedFiles":
                    return { ...state, sharedFilesViewPath: [] }
                case "downloadableFiles":
                    return { ...state, downloadableFilesViewPath: [] }
                default:
                    return state
            }
        }
    }
    return state
}
