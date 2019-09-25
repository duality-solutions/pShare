import { DownloadableFile } from "../../types/DownloadableFile";
import { SharedFile } from "../../types/SharedFile";

export interface FileEntry<T extends DownloadableFile|SharedFile> {
    type: "file";
    name: string;
    fileInfo: T
}
