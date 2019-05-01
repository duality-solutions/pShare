import { FileRequest } from "./FileRequest";
export interface FileReceiveFailure {
    error: any;
    fileRequest: FileRequest;
}
