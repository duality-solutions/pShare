import { PromiseResolver, ResolvedState } from "./PromiseResolver";


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
    const res = resolve;
    const rej = reject
    let state: ResolvedState;

    const complete = () => {
        return typeof state !== 'undefined'
    }


    return {
        resolve: (value: T) => {
            if (complete()) {
                return
            }
            state = "resolved"
            res(value)
        },
        cancel: () => {
            if (complete()) {
                return
            }
            state = "cancelled"
            rej(Error("cancelled"))

        }, reject: (err: any) => {
            if (complete()) {
                return
            }
            state = "rejected"
            rej(err)

        },
        get state() {
            return state
        },
        get complete() {
            return complete()
        },
        promise
    };
};

