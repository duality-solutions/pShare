import { ClientDownloadActions } from "../actions/clientDownload";
import { getType } from "typesafe-actions";
import { FileRequest } from "../actions/payloadTypes/FileRequest";
import { deleteOptionalProperty } from "../system/deleteOptionalProperty";
interface ClientDownloadsState {
    currentSessions: Record<string, FileRequestDownloadState>
}
type FileRequestDownloadStatus = "not started" | "downloading"
export interface FileRequestDownloadState extends FileRequest {
    status: FileRequestDownloadStatus
    progressPct: number
    downloadedBytes: number
    size: number
    key: string
}
const defaultState: ClientDownloadsState = {
    currentSessions: {}
};
export const clientDownloads = (state: ClientDownloadsState = defaultState, action: ClientDownloadActions): ClientDownloadsState => {
    switch (action.type) {
        case getType(ClientDownloadActions.clientDownloadStarted): {
            const { fileRequest, fileInfo } = action.payload
            const rec: FileRequestDownloadState = { ...fileRequest, status: "not started", progressPct: 0, key: createKey(fileRequest), size: fileInfo.size, downloadedBytes: 0 }
            return { ...state, currentSessions: { ...state.currentSessions, [rec.key]: rec } }
        }
        case getType(ClientDownloadActions.clientDownloadProgress): {
            const { fileRequest, progressPct, downloadedBytes, size } = action.payload
            const key = createKey(fileRequest)
            const currentRec = state.currentSessions[key]
            if (currentRec == null) {
                return state
            }
            const rec: FileRequestDownloadState = { ...currentRec, ...fileRequest, status: "downloading", progressPct, key, downloadedBytes, size }
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

