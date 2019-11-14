import { FileEntry } from "./FileEntry";
import { DownloadableFile } from "../../types/DownloadableFile";
import { SharedFile } from "../../types/SharedFile";
export interface DirectoryEntry<T extends DownloadableFile | SharedFile> {
    type: "directory";
    entries: (FileEntry<T> | DirectoryEntry<T>)[];
    name?: string;
    fullPath?: string;
}
