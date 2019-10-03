import { FileRequest } from "./FileRequest";

export interface FileRequestWithSavePath extends FileRequest {
    savePath: string;
    type: "file";
}
export function isFileRequestWithSavePath(
    item: FileRequest
): item is FileRequestWithSavePath {
    const x = item as FileRequestWithSavePath;
    return x.type === "file" && x.hasOwnProperty("savePath");
}
