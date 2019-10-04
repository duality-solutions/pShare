import { PublicSharedFile } from "../../types/PublicSharedFile";
export interface FileListResponse {
    requestId: string;
    sharedFiles: PublicSharedFile[];
}
