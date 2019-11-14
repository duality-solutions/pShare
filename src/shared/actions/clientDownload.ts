import { createStandardAction, ActionType } from "typesafe-actions";
import { FileRequest } from "./payloadTypes/FileRequest";
import { FileInfo } from "./payloadTypes/FileInfo";
export const ClientDownloadActions = {
  clientDownloadStarted: createStandardAction(
    "clientDownload/DOWNLOAD_STARTED"
  )<{ fileRequest: FileRequest; fileInfo: FileInfo }>(),
  clientDownloadComplete: createStandardAction(
    "clientDownload/DOWNLOAD_COMPLETE"
  )<FileRequest>(),
  clientDownloadProgress: createStandardAction(
    "clientDownload/DOWNLOAD_PROGRESS"
  )<{
    fileRequest: FileRequest;
    progressPct: number;
    downloadedBytes: number;
    size: number;
    speed: number;
    eta?: number;
  }>()
};
export type ClientDownloadActions = ActionType<typeof ClientDownloadActions>;
