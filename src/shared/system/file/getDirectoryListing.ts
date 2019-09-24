import { blinq } from "blinq";
import { FileEntry } from "./FileEntry";
import { DirectoryEntry } from "./DirectoryEntry";
export function getDirectoryListing(path: string, rootDirectory: DirectoryEntry): (FileEntry | DirectoryEntry)[] {

    var matchArr = path.match(/^(.*?)\/*$/)
    const correctedPath = matchArr == null ? path : matchArr[1];
    const pathSegments = correctedPath.split("/");
    return getDirectoryListingFromPathSegments(pathSegments, rootDirectory);
}
function getDirectoryListingFromPathSegments(pathSegments: string[], rootDirectory: DirectoryEntry): (FileEntry | DirectoryEntry)[] {
    let directoryNames = pathSegments.map(p => `${p}/`);
    let currentDirectory: DirectoryEntry | undefined = rootDirectory;
    while (directoryNames.length > 0 && currentDirectory != null) {
        const [dName, ...rest] = directoryNames;
        directoryNames = rest;
        const entry: DirectoryEntry | undefined = currentDirectory
            ? blinq(currentDirectory.entries).firstOrDefault(e => e.type === "directory" && e.name === dName) as DirectoryEntry
            : undefined;
        currentDirectory = entry;
    }
    return currentDirectory ? currentDirectory.entries : [];
}
