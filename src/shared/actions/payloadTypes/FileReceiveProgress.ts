import { FileRequest } from "./FileRequest";
export interface FileReceiveProgress {
    totalBytes: number;
    downloadedBytes: number;
    downloadedPct: number
    fileRequest: FileRequest;
}
