// https://stackoverflow.com/a/49579497/14357
export type PublicOnly<T> = Pick<T, keyof T>;
