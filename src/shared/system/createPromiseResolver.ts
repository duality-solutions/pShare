import { PromiseResolver } from "./PromiseResolver";

export const createPromiseResolver = <T>(): PromiseResolver<T> => {
    let resolve: ((val: T) => void) | undefined;
    let reject: ((err: any) => void) | undefined;
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    if (typeof resolve === 'undefined' || typeof reject === 'undefined') {
        throw Error("Promise is broken");
    }
    return { resolve, reject, promise };
};

