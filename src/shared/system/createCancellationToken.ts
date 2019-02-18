import { mergePropertiesAsReadOnly } from "./mergePropertiesAsReadOnly";
interface CancellationTokenMethods {
    cancel: (e?: Error) => void
    register: (callback: (e: any) => void) => void
    createDependentToken: () => CancellationToken
}
interface CancellationTokenProps {
    readonly isCancellationRequested: boolean
}

export type CancellationToken = CancellationTokenMethods & CancellationTokenProps

export function createCancellationToken(timeout: number): CancellationToken;
export function createCancellationToken(parentToken?: CancellationToken): CancellationToken;
export function createCancellationToken(parentTokenOrNumber?: CancellationToken | number): CancellationToken {
    const t = typeof parentTokenOrNumber
    const parentToken = (t !== 'undefined' && t !== 'number') ? parentTokenOrNumber as CancellationToken : undefined
    const timeout = (t !== 'undefined' && t === 'number') ? parentTokenOrNumber as number : undefined
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
    methods.createDependentToken = () => createCancellationToken(token);
    if (parentToken) {
        parentToken.register(e => token.cancel(e));
    }
    mergePropertiesAsReadOnly(methods, token);
    if (timeout) {
        setTimeout(() => methods.cancel(), timeout)
    }
    return token;
};
