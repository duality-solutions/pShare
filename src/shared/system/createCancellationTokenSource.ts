import { mergePropertiesAsReadOnly } from "./mergePropertiesAsReadOnly";
import { createPromiseResolver } from "./createPromiseResolver";

export interface CancellationTokenRegistration {
    unregister: () => void
}

interface CancellationTokenCommonMethods{
    createLinkedTokenSource: (timeout?: number) => CancellationTokenSource
}
interface CancellationTokenSourceMethods extends CancellationTokenCommonMethods {
    cancel: (e?: Error) => Promise<void>
    getToken(): CancellationToken
    
}
interface CancellationTokenMethods extends CancellationTokenCommonMethods {
    register: (callback: (e: any) => Promise<void> | void) => CancellationTokenRegistration
}
interface CancellationTokenProps {
    readonly isCancellationRequested: boolean
}


export type CancellationTokenSource = CancellationTokenSourceMethods & CancellationTokenProps

export type CancellationToken = CancellationTokenMethods & CancellationTokenProps

export function createCancellationTokenSource(timeout?: number, parentToken?: CancellationToken): CancellationTokenSource {

    const source = {} as CancellationTokenSource;
    const token = {} as CancellationToken
    let cancellationRequested = false;
    Object.defineProperty(token, 'isCancellationRequested', {
        get: () => cancellationRequested,
        configurable: false,
        enumerable: true
    });
    Object.defineProperty(source, 'isCancellationRequested', {
        get: () => cancellationRequested,
        configurable: false,
        enumerable: true
    });
    const cancellationTokenMethods = {} as CancellationTokenMethods;
    const cancellationTokenSourceMethods = {} as CancellationTokenSourceMethods;
    const registrationPromises = new Set<Promise<void>>()
    const cancellationPromise = new Promise(resolve => {
        cancellationTokenSourceMethods.cancel = async e => {
            cancellationRequested = true;
            if (e) {
                resolve(e);
            }
            else {
                const err = new Error("cancelled");
                resolve(err);
            }
            await Promise.all(registrationPromises)
        };
    });
    cancellationTokenSourceMethods.getToken = () => token
    cancellationTokenMethods.register = (callback) => {
        const resolver = createPromiseResolver()
        const completionPromise =
            Promise
                .race([resolver.promise, cancellationPromise]).then(async (p: any) => {
                    //debugger
                    if (p && p.message && p.message === "cancelled") {
                        return await p
                    } else {
                        throw Error("unregistered")
                    }
                })
                .then(v => callback(v))
                .catch(err => {
                    if (err.message !== "unregistered") {
                        throw err
                    }
                })

        registrationPromises.add(completionPromise)
        return {
            unregister: () => {
                registrationPromises.delete(completionPromise)
                resolver.resolve();
            }
        }

    };
    cancellationTokenSourceMethods.createLinkedTokenSource = (timeout?: number) => createCancellationTokenSource(timeout, token);
    cancellationTokenMethods.createLinkedTokenSource = (timeout?: number) => createCancellationTokenSource(timeout, token);
    if (parentToken) {
        parentToken.register(e => source.cancel(e));
    }
    mergePropertiesAsReadOnly(cancellationTokenMethods, token);
    mergePropertiesAsReadOnly(cancellationTokenSourceMethods, source);
    if (timeout) {
        setTimeout(() => cancellationTokenSourceMethods.cancel(), timeout)
    }
    return source;
};

export const asCancellable = <T>(promise: Promise<T>, cancellationToken: CancellationToken): Promise<T> => {
    const resolver = createPromiseResolver<T>()
    cancellationToken.register(() => resolver.cancel())
    promise.then(v => resolver.resolve(v)).catch(e => resolver.reject(e))
    return resolver.promise
}
