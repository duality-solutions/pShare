// https://stackoverflow.com/a/48687313/14357
export function tuple<T extends any[]>(...data: T) {
    return data;
}