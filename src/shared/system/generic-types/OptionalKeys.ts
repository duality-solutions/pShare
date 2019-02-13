// https://stackoverflow.com/a/49579497/14357
/** Extracts optional keys from T */
export type OptionalKeys<T> = {
    [K in keyof T]-?: ({} extends {
        [P in K]: T[K];
    } ? K : never);
}[keyof T];
