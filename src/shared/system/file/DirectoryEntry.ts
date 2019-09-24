import { FileEntry } from "./FileEntry";
export interface DirectoryEntry {
    type: "directory";
    entries: (FileEntry | DirectoryEntry)[];
    name?: string;
}
