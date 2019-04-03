import { mergePropertiesAsReadOnly } from "./mergePropertiesAsReadOnly";
import { createPromiseResolver } from "./createPromiseResolver";

export interface CancellationTokenRegistration {
    unregister: () => void
}
interface CancellationTokenMethods {
    cancel: (e?: Error) => Promise<void>
    register: (callback: (e: any) => Promise<void> | void) => CancellationTokenRegistration
    createDependentToken: (timeout?: number) => CancellationToken
}
interface CancellationTokenProps {
    readonly isCancellationRequested: boolean
}

export type CancellationToken = CancellationTokenMethods & CancellationTokenProps

export function createCancellationToken(timeout?: number, parentToken?: CancellationToken): CancellationToken {

    const token = {} as CancellationToken;
    let cancellationRequested = false;
    Object.defineProperty(token, 'isCancellationRequested', {
        get: () => cancellationRequested,
        configurable: false,
        enumerable: true
    });
    let methods = {} as CancellationTokenMethods;
    const registrationPromises = new Set<Promise<void>>()
    const cancellationPromise = new Promise(resolve => {
        methods.cancel = async e => {
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
    methods.register = (callback) => {
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
                resolver.resolve({});
            }
        }

    };
    methods.createDependentToken = (timeout?: number) => createCancellationToken(timeout, token);
    if (parentToken) {
        parentToken.register(e => token.cancel(e));
    }
    mergePropertiesAsReadOnly(methods, token);
    if (timeout) {
        setTimeout(() => methods.cancel(), timeout)
    }
    return token;
};

export const asCancellable = <T>(promise: Promise<T>, cancellationToken: CancellationToken): Promise<T> => {
    const resolver = createPromiseResolver<T>()
    cancellationToken.register(() => resolver.cancel())
    promise.then(v => resolver.resolve(v)).catch(e => resolver.reject(e))
    return resolver.promise
}
