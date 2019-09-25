import { DownloadableFile } from "./DownloadableFile";
import { SharedFilesFetchState } from "./SharedFilesFetchState";
export interface SharedFilesState {
    linkedUserName?: string;
    linkedCommonName?: string;
    downloadableFiles?: DownloadableFile[];
    state: SharedFilesFetchState;
}
