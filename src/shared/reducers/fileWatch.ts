import { FileWatchActions } from "../actions/fileWatch";
import { SharedFile } from "../types/SharedFile";
import { getType } from "typesafe-actions";
import { deleteOptionalProperty } from "../system/deleteOptionalProperty";

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
// todo: this is nasty. some sort of functional lense might be a way to tidy this up. shades.js is a possible candidate
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
        case (getType(FileWatchActions.fileUnlinked)):
            return {
                ...state,
                users: {
                    ...state.users,
                    [action.payload.sharedWith]: {
                        ...state.users[action.payload.sharedWith],
                        in: action.payload.direction !== "in"
                            ? (state.users[action.payload.sharedWith] || {}).in
                            : deleteOptionalProperty(((state.users[action.payload.sharedWith] || {}).in) || {}, action.payload.relativePath),
                        out: action.payload.direction !== "out"
                            ? (state.users[action.payload.sharedWith] || {}).out
                            : deleteOptionalProperty(((state.users[action.payload.sharedWith] || {}).out) || {}, action.payload.relativePath),
                    }
                }
            }
        default:
            return state
    }
}