import { DashboardActions } from "../actions/dashboard";
import { getType } from "typesafe-actions";
import { SharedFilesActions } from "../actions/sharedFiles";
import { FileListActions } from "../actions/fileList";
import { PublicSharedFile } from "../types/PublicSharedFile";
import { deleteOptionalProperty } from "../system/deleteOptionalProperty";
import { RtcActions } from "../actions/rtc";

export interface SharedFilesState {
    linkedUserName?: string,
    linkedCommonName?: string,
    downloadableFiles?: DownloadableFile[]
}

export interface DownloadableFile {
    file: PublicSharedFile
    isDownloading: boolean
    progressPct: number
}

const defaultState: SharedFilesState = {
}

export const sharedFiles = (state: SharedFilesState = defaultState, action: DashboardActions | SharedFilesActions | FileListActions | RtcActions): SharedFilesState => {
    switch (action.type) {
        case getType(DashboardActions.viewSharedFiles):
            return { ...state, linkedUserName: action.payload.object_id, linkedCommonName: action.payload.common_name }
        case getType(FileListActions.fileListFetchSuccess):
            return { ...state, downloadableFiles: action.payload.map<DownloadableFile>(file => ({ file, isDownloading: false, progressPct: 0 })) }
        case getType(FileListActions.fileListFetchFailed):
            return deleteOptionalProperty(state, "downloadableFiles")
        case getType(SharedFilesActions.close):
            const { linkedUserName, ...rest } = state
            return rest
        case getType(RtcActions.fileReceiveSuccess):
            {
                const fileRequest = action.payload
                const mappedDownloadableFiles: DownloadableFile[] = (state.downloadableFiles || [])
                    .map(df => df.file.fileName === fileRequest.fileName
                        && df.file.hash === fileRequest.fileId
                        ? { isDownloading: false, progressPct: 100, file: df.file }
                        : df)
                return { ...state, downloadableFiles: mappedDownloadableFiles }
            }
        case getType(RtcActions.fileReceiveFailed):
            {
                const { fileRequest } = action.payload
                const mappedDownloadableFiles: DownloadableFile[] = (state.downloadableFiles || [])
                    .map(df => df.file.fileName === fileRequest.fileName
                        && df.file.hash === fileRequest.fileId
                        ? { isDownloading: false, progressPct: 0, file: df.file }
                        : df)
                return { ...state, downloadableFiles: mappedDownloadableFiles }
            }
        case getType(RtcActions.fileReceiveProgress):
            {
                const { fileRequest, downloadedPct } = action.payload
                const mappedDownloadableFiles: DownloadableFile[] = (state.downloadableFiles || [])
                    .map(df => df.file.fileName === fileRequest.fileName
                        && df.file.hash === fileRequest.fileId
                        ? { isDownloading: true, progressPct: downloadedPct, file: df.file }
                        : df)
                return { ...state, downloadableFiles: mappedDownloadableFiles }
            }
        default:
            return state
    }
}