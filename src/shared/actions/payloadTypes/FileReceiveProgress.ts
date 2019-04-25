import { FileRequest } from '../fileSharing';
export interface FileReceiveProgress {
    totalBytes: number;
    downloadedBytes: number;
    fileRequest: FileRequest;
}
