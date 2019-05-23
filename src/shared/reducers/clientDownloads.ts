import { ClientDownloadActions } from "../actions/clientDownload";
import { getType } from "typesafe-actions";
import { FileRequest } from "../actions/payloadTypes/FileRequest";
import { deleteOptionalProperty } from "../system/deleteOptionalProperty";
interface ClientDownloadsState {
    currentSessions: Record<string, FileRequestDownloadState>
}
type FileRequestDownloadStatus = "not started" | "downloading"
interface FileRequestDownloadState extends FileRequest {
    status: FileRequestDownloadStatus
    progressPct: number
    key: string
}
const defaultState: ClientDownloadsState = {
    currentSessions: {}
};
export const clientDownloads = (state: ClientDownloadsState = defaultState, action: ClientDownloadActions): ClientDownloadsState => {
    switch (action.type) {
        case getType(ClientDownloadActions.clientDownloadStarted): {
            const fileRequest = action.payload
            const rec: FileRequestDownloadState = { ...fileRequest, status: "not started", progressPct: 0, key: createKey(fileRequest) }
            return { ...state, currentSessions: { ...state.currentSessions, [rec.key]: rec } }
        }
        case getType(ClientDownloadActions.clientDownloadProgress): {
            const { fileRequest, progressPct } = action.payload
            const rec: FileRequestDownloadState = { ...fileRequest, status: "downloading", progressPct, key: createKey(fileRequest) }
            return { ...state, currentSessions: { ...state.currentSessions, [rec.key]: rec } }
        }
        case getType(ClientDownloadActions.clientDownloadComplete): {
            const fileRequest = action.payload
            return { ...state, currentSessions: deleteOptionalProperty(state.currentSessions, createKey(fileRequest)) }
        }
    }
    return state;
};
function createKey(fileRequest: FileRequest): string {
    return `${fileRequest.requestorUserName} ${fileRequest.fileId} ${fileRequest.fileName}`;
}

