// https://stackoverflow.com/a/49579497/14357
export type RequiredKeys<T> = {
    [K in keyof T]-?: ({} extends {
        [P in K]: T[K];
    } ? never : K);
}[keyof T];

