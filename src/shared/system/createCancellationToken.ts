import { mergePropertiesAsReadOnly } from "./mergePropertiesAsReadOnly";
interface CancellationTokenMethods {
    cancel: (e?: Error) => void
    register: (callback: (e: any) => void) => void
    createDependentToken: () => CancellationToken
}
export interface CancellationToken {
    readonly isCancellationRequested: boolean
    cancel: (e?: Error) => void
    register: (callback: (e: any) => void) => void
    createDependentToken: () => CancellationToken
}

export const createCancellationToken = (parentToken?: CancellationToken) => {
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
    methods.register = callback => {
        cancellationPromise.then(v => callback(v));
    };
    methods.createDependentToken = () => createCancellationToken(token);
    if (parentToken) {
        parentToken.register(e => token.cancel(e));
    }
    mergePropertiesAsReadOnly(methods, token);
    return token;
};
