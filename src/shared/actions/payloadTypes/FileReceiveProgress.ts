import { FileRequest } from "./FileRequest";
export interface FileReceiveProgress {
    totalBytes: number;
    downloadedBytes: number;
    fileRequest: FileRequest;
}
