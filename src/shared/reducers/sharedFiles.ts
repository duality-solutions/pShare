import { DashboardActions } from "../actions/dashboard";
import { getType } from "typesafe-actions";
import { SharedFilesActions } from "../actions/sharedFiles";
import { FileListActions } from "../actions/fileList";
import { PublicSharedFile } from "../types/PublicSharedFile";
import { deleteOptionalProperty } from "../system/deleteOptionalProperty";
import { RtcActions } from "../actions/rtc";
import { blinq } from "blinq";
import { FileSharingActions } from "../actions/fileSharing";

export type SharedFilesFetchState = "initial" | "downloading" | "success" | "failed"
export interface SharedFilesState {
    linkedUserName?: string,
    linkedCommonName?: string,
    downloadableFiles?: DownloadableFile[],
    state: SharedFilesFetchState
}
export type DownloadState = "ready" | "starting" | "downloading" | "downloaded" | "failed"
export interface DownloadableFile {
    file: PublicSharedFile
    state: DownloadState
    progressPct: number
    progressStatus?: string
}

const defaultState: SharedFilesState = {
    state: "initial"
}

export const sharedFiles = (state: SharedFilesState = defaultState, action: DashboardActions | SharedFilesActions | FileListActions | RtcActions | FileSharingActions): SharedFilesState => {
    switch (action.type) {
        case getType(DashboardActions.viewSharedFiles):
            return { ...state, linkedUserName: action.payload.object_id, linkedCommonName: action.payload.common_name }

        case getType(FileListActions.fileListFetchSuccess):
            const downloadableFiles =
                blinq(action.payload)
                    .leftOuterJoin<PublicSharedFile, DownloadableFile, string, DownloadableFile>(
                        state.downloadableFiles || [],
                        psf => (psf.hash + psf.fileName),
                        df => (df.file.hash + df.file.fileName),
                        (psf, df) =>
                            typeof df === "undefined"
                                ? { file: psf, state: "ready" as DownloadState, progressPct: 0 }
                                : { ...df, file: psf })
                    .toArray()
            return {
                ...state,
                downloadableFiles,
                state: "success"
            }


        case getType(DashboardActions.startViewSharedFiles):
            return { ...state, state: "downloading" }
        case getType(FileListActions.fileListFetchFailed):
            return { ...deleteOptionalProperty(state, "downloadableFiles"), state: "failed" }

        case getType(SharedFilesActions.close):
            const { linkedUserName, ...rest } = { ...state }
            return { ...rest, state: "initial" }


        case getType(FileSharingActions.requestFileWithSavePath):
            {
                const fileRequest = action.payload
                const mappedDownloadableFiles: DownloadableFile[] = (state.downloadableFiles || [])
                    .map<DownloadableFile>(df => df.file.fileName === fileRequest.fileName
                        && df.file.hash === fileRequest.fileId
                        ? { state: "starting", progressPct: 100, file: df.file }
                        : df)
                return { ...state, downloadableFiles: mappedDownloadableFiles }
            }

        case getType(RtcActions.fileReceiveSuccess):
            {
                const fileRequest = action.payload
                const mappedDownloadableFiles: DownloadableFile[] = (state.downloadableFiles || [])
                    .map<DownloadableFile>(df => df.file.fileName === fileRequest.fileName
                        && df.file.hash === fileRequest.fileId
                        ? { state: "downloaded", progressPct: 100, file: df.file }
                        : df)
                return { ...state, downloadableFiles: mappedDownloadableFiles }
            }

        case getType(RtcActions.fileReceiveFailed):
            {
                const { fileRequest } = action.payload
                const mappedDownloadableFiles: DownloadableFile[] = (state.downloadableFiles || [])
                    .map<DownloadableFile>(df => df.file.fileName === fileRequest.fileName
                        && df.file.hash === fileRequest.fileId
                        ? { state: "failed", progressPct: 0, file: df.file }
                        : df)
                return { ...state, downloadableFiles: mappedDownloadableFiles }
            }

        case getType(RtcActions.fileReceiveProgress):
            {
                const { fileRequest, downloadedPct, status } = action.payload
                const mappedDownloadableFiles: DownloadableFile[] = (state.downloadableFiles || [])
                    .map<DownloadableFile>(df => df.file.fileName === fileRequest.fileName
                        && df.file.hash === fileRequest.fileId
                        ? { state: "downloading", progressPct: downloadedPct, file: df.file, progressStatus: status }
                        : df)
                return { ...state, downloadableFiles: mappedDownloadableFiles }
            }

        default:
            return state
    }
}