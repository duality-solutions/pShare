import { FileRequest } from "./FileRequest";
export interface FileReceiveProgress {
  totalBytes: number;
  downloadedBytes: number;
  downloadedPct: number;
  fileRequest: FileRequest;
  status?: string;
  speed: number;
  eta?: number;
}
