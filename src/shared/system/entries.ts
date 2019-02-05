import { blinq } from "blinq";
import { Enumerable } from "blinq/dist/types/src/Enumerable";
export const entries =
    <T, TK extends keyof T, TV extends T[TK], TEntry extends [TK, TV]>(o: T): Enumerable<TEntry> =>
        blinq(Object.entries(o) as TEntry[]);

export const keys = <T>(o: T): Enumerable<keyof T> =>
    entries(o).select(([k,]) => k)

export const entriesToObject =
    <T>(entries: Enumerable<[keyof T, T[keyof T]]>): T =>
        entries.aggregate({} as T, (prev, [k, v]) => { prev[k] = v; return prev; });
