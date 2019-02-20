// https://stackoverflow.com/a/49579497/14357
import { IfEquals } from "./IfEquals";
export type ReadonlyKeys<T> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
            -readonly [Q in P]: T[P];
        }, never, P>;
}[keyof T];
