export type ProgressHandler = (progress: number, speed: number, eta: number | undefined, downloadedBytes: number, size: number) => any;
