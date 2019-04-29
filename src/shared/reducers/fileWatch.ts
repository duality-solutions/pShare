import { FileWatchActions } from "../actions/fileWatch";
import { SharedFile } from "../types/SharedFile";
import { getType } from "typesafe-actions";

interface InOutSharedFiles {
    in: Record<string, SharedFile>
    out: Record<string, SharedFile>
}

interface FileWatchState {
    users: Record<string, InOutSharedFiles>
}

const defaultState: FileWatchState = {
    users: {}
}

export const fileWatch = (state: FileWatchState = defaultState, action: FileWatchActions) => {
    switch (action.type) {
        case (getType(FileWatchActions.fileAdded)):
            return {
                ...state,
                users: {
                    ...state.users,
                    [action.payload.sharedWith]: {
                        ...state.users[action.payload.sharedWith],
                        in: action.payload.direction !== "in"
                            ? (state.users[action.payload.sharedWith] || {}).in
                            : {
                                ...((state.users[action.payload.sharedWith] || {}).in),
                                [action.payload.relativePath]: action.payload
                            },
                        out: action.payload.direction !== "out"
                            ? (state.users[action.payload.sharedWith] || {}).out
                            : {
                                ...((state.users[action.payload.sharedWith] || {}).out),
                                [action.payload.relativePath]: action.payload
                            },
                    }
                }
            }
        default:
            return state
    }
}