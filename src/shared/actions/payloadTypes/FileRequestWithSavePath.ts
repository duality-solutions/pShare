import { FileRequest } from "./FileRequest";
export interface FileRequestWithSavePath extends FileRequest {
    savePath: string;
}
