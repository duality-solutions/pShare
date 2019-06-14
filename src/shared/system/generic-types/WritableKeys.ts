// https://stackoverflow.com/a/49579497/14357
import { IfEquals } from "./IfEquals";
export type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
            -readonly [Q in P]: T[P];
        }, P>;
}[keyof T];
