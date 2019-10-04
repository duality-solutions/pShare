export interface FileRequest {
    ownerUserName: string;
    requestorUserName: string;
    fileName: string
    type: "file" | "file-list"
}

