export function isPromise(obj: any) {
    return (typeof obj === 'undefined' ? 'undefined' : typeof (obj)) === 'object' && typeof obj.then === 'function';
}
