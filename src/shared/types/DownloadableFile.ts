import { PublicSharedFile } from "./PublicSharedFile";
import { DownloadState } from "./DownloadState";
export interface DownloadableFile {
  file: PublicSharedFile;
  state: DownloadState;
  progressPct: number;
  progressStatus?: string;
  speed: number;
  eta?: number;
}
