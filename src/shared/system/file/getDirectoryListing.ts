import { blinq } from "blinq";
import { FileEntry } from "./FileEntry";
import { DirectoryEntry } from "./DirectoryEntry";
import { SharedFile } from "../../types/SharedFile";
import { DownloadableFile } from "../../types/DownloadableFile";
export function getDirectoryListing<T extends SharedFile | DownloadableFile>(path: string, rootDirectory: DirectoryEntry<T>): (FileEntry<T> | DirectoryEntry<T>)[] {

    var matchArr = path.match(/^(.*?)\/*$/)
    const correctedPath = matchArr == null ? path : matchArr[1];
    const pathSegments = correctedPath.split("/");
    return getDirectoryListingFromPathSegments(pathSegments, rootDirectory);
}
function getDirectoryListingFromPathSegments<T extends SharedFile | DownloadableFile>(pathSegments: string[], rootDirectory: DirectoryEntry<T>): (FileEntry<T> | DirectoryEntry<T>)[] {
    let directoryNames = pathSegments.map(p => `${p}/`);
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
