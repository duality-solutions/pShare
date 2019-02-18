import { mergePropertiesAsReadOnly } from "./mergePropertiesAsReadOnly";
interface CancellationTokenMethods {
    cancel: (e?: Error) => void
    register: (callback: (e: any) => void) => void
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
    const cancellationPromise = new Promise(resolve => {
        methods.cancel = e => {
            cancellationRequested = true;
            if (e) {
                resolve(e);
            }
            else {
                const err = new Error("cancelled");
                resolve(err);
            }
        };
    });
    methods.register = async (callback) => {
        let v: {};
        try {
            v = await cancellationPromise;
        } catch (err) {
            console.log(err)
            return
        }
        callback(v)
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
