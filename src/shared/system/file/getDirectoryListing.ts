import { blinq } from "blinq";
import { FileEntry } from "./FileEntry";
import { DirectoryEntry } from "./DirectoryEntry";
import { SharedFile } from "../../types/SharedFile";
import { DownloadableFile } from "../../types/DownloadableFile";
export function getDirectoryListing<T extends SharedFile | DownloadableFile>(path: string, rootDirectory: DirectoryEntry<T>): (FileEntry<T> | DirectoryEntry<T>)[] {

    if(path.startsWith("/")){
        throw Error("paths should not start with '/'")
    }
    const pathSegments = path.split("/");
    if (pathSegments.length === 1 && pathSegments[0] === "") {
        return rootDirectory.entries
    }
    return getDirectoryListingFromPathSegments(pathSegments, rootDirectory);
}
function getDirectoryListingFromPathSegments<T extends SharedFile | DownloadableFile>(pathSegments: string[], rootDirectory: DirectoryEntry<T>): (FileEntry<T> | DirectoryEntry<T>)[] {
    let directoryNames = pathSegments;
    let currentDirectory: DirectoryEntry<T> | undefined = rootDirectory;
    while (directoryNames.length > 0 && currentDirectory != null) {
        const [dName, ...rest] = directoryNames;
        directoryNames = rest;
        const entry: DirectoryEntry<T> | undefined = currentDirectory
            ? blinq(currentDirectory.entries).firstOrDefault(e => e.type === "directory" && e.name === dName) as DirectoryEntry<T>
            : undefined;
        currentDirectory = entry;
    }
    return currentDirectory ? currentDirectory.entries : [];
}
