export interface SharedFile {
    sharedWith: string;
    relativePath: string;
    path: string;
    size?: number;
    contentType?: string;
    direction: "in" | "out";
    //hash?:string
}
