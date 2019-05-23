import { createStandardAction, ActionType } from 'typesafe-actions';
import { FileRequest } from './payloadTypes/FileRequest';
export const ClientDownloadActions = {
    clientDownloadStarted: createStandardAction('clientDownload/DOWNLOAD_STARTED')<FileRequest>(),
    clientDownloadComplete: createStandardAction('clientDownload/DOWNLOAD_COMPLETE')<FileRequest>(),
    clientDownloadProgress: createStandardAction('clientDownload/DOWNLOAD_PROGRESS')<{
        fileRequest: FileRequest;
        progressPct: number;
    }>(),
};
export type ClientDownloadActions = ActionType<typeof ClientDownloadActions>;
