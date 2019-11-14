import { FileRequest } from "./FileRequest";
export interface FileListRequest extends FileRequest {
    type: "file-list";
    requestId: string;
}
export function isFileListRequest(item: FileRequest): item is FileListRequest {
    const x = item as FileListRequest;
    return x.type === "file-list" && x.hasOwnProperty("requestId");
}
