import { DashboardActions } from "../actions/dashboard";
import { getType } from "typesafe-actions";
import { SharedFilesActions } from "../actions/sharedFiles";
import { FileListActions } from "../actions/fileList";
import { PublicSharedFile } from "../types/PublicSharedFile";
import { deleteOptionalProperty } from "../system/deleteOptionalProperty";
import { RtcActions } from "../actions/rtc";
import { blinq } from "blinq";
import { FileSharingActions } from "../actions/fileSharing";
import { DownloadableFile } from "../types/DownloadableFile";
import { DownloadState } from "../types/DownloadState";
import { SharedFilesState } from "../types/SharedFilesState";

const defaultState: SharedFilesState = {
  state: "initial"
};

export const sharedFiles = (
  state: SharedFilesState = defaultState,
  action:
    | DashboardActions
    | SharedFilesActions
    | FileListActions
    | RtcActions
    | FileSharingActions
): SharedFilesState => {
  switch (action.type) {
    case getType(DashboardActions.viewSharedFiles):
      return {
        ...state,
        linkedUserName: action.payload.object_id,
        linkedCommonName: action.payload.common_name
      };

    case getType(FileListActions.fileListFetchSuccess):
      const downloadableFiles = blinq(action.payload)
        .leftOuterJoin<
          PublicSharedFile,
          DownloadableFile,
          string,
          DownloadableFile
        >(
          state.downloadableFiles || [],
          psf => psf.fileName,
          df => df.file.fileName,
          (psf, df) =>
            typeof df === "undefined"
              ? {
                  file: psf,
                  state: "ready" as DownloadState,
                  progressPct: 0,
                  speed: 0
                }
              : { ...df, file: psf }
        )
        .toArray();
      return {
        ...state,
        downloadableFiles,
        state: "success"
      };

    case getType(DashboardActions.startViewSharedFiles):
      return { ...state, state: "downloading" };
    case getType(FileListActions.fileListFetchFailed):
      return {
        ...deleteOptionalProperty(state, "downloadableFiles"),
        state: "failed"
      };

    case getType(SharedFilesActions.close):
      const { linkedUserName, ...rest } = { ...state };
      return { ...rest, state: "initial" };

    case getType(FileSharingActions.startRequestFile): {
      const fileRequest = action.payload;
      const mappedDownloadableFiles: DownloadableFile[] = (
        state.downloadableFiles || []
      ).map<DownloadableFile>(df =>
        df.file.fileName === fileRequest.fileName
          ? { state: "starting", progressPct: 0, file: df.file, speed: 0 }
          : df
      );
      return { ...state, downloadableFiles: mappedDownloadableFiles };
    }

    case getType(RtcActions.fileReceiveSuccess): {
      const fileRequest = action.payload;
      const mappedDownloadableFiles: DownloadableFile[] = (
        state.downloadableFiles || []
      ).map<DownloadableFile>(df =>
        df.file.fileName === fileRequest.fileName
          ? {
              state: "downloaded",
              progressPct: 100,
              file: df.file,
              speed: 0,
              eta: 0
            }
          : df
      );
      return { ...state, downloadableFiles: mappedDownloadableFiles };
    }

    case getType(RtcActions.fileReceiveReset): {
      const fileRequest = action.payload;
      const mappedDownloadableFiles: DownloadableFile[] = (
        state.downloadableFiles || []
      ).map<DownloadableFile>(df =>
        df.file.fileName === fileRequest.fileName
          ? { state: "ready", progressPct: 0, file: df.file, speed: 0 }
          : df
      );
      return { ...state, downloadableFiles: mappedDownloadableFiles };
    }

    case getType(RtcActions.fileReceiveFailed): {
      const { fileRequest } = action.payload;
      const mappedDownloadableFiles: DownloadableFile[] = (
        state.downloadableFiles || []
      ).map<DownloadableFile>(df =>
        df.file.fileName === fileRequest.fileName
          ? { state: "failed", progressPct: 0, file: df.file, speed: 0 }
          : df
      );
      return { ...state, downloadableFiles: mappedDownloadableFiles };
    }

    case getType(RtcActions.fileReceiveProgress): {
      const { fileRequest, downloadedPct, status, speed, eta } = action.payload;
      const mappedDownloadableFiles: DownloadableFile[] = (
        state.downloadableFiles || []
      ).map<DownloadableFile>(df =>
        df.file.fileName === fileRequest.fileName
          ? {
              state: "downloading",
              progressPct: downloadedPct,
              file: df.file,
              progressStatus: status,
              speed,
              eta
            }
          : df
      );
      return { ...state, downloadableFiles: mappedDownloadableFiles };
    }

    default:
      return state;
  }
};
