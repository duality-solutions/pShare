export interface PromiseResolver<T> {
    resolve: (val: T) => void;
    reject: (err: any) => void;
    promise: Promise<T>;
}
