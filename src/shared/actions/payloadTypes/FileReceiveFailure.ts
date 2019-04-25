import { FileRequest } from '../fileSharing';
export interface FileReceiveFailure {
    error: any;
    fileRequest: FileRequest;
}
