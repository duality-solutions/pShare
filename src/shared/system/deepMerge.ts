import { blinq } from "blinq";
import { Enumerable } from "blinq/dist/types/src/Enumerable";
import { entriesToObject, entries } from "./entries";

/**
 * Merges n objects into a single (new) object, or if all objects are equal (===) 
 * (i.e. they're the same object), then no merge is necessary and that same object is returned.
 * Objects are assumed to be immutable, allowing maximum reuse. No attempt is made to merge arrays.
 * For the same property in several items, the last (or rightmost) property's value will be the one
 * merged into the return value
 * @param items items to merge. at least 1 item must be provided, else an error will be thrown
 * if items are mixed mergable/non-mergable (i.e. a mixture of objects with anything else including arrays), 
 * no attempt will be made to merge. This applies recursively to the entire object graphs being merged.
 */
export const deepMerge =
    <T>(...items: T[]): T => {
        const itms = blinq(items).groupBy(i => i).select(g => g.key)
        const numItms = itms.count()
        let areMergable: boolean
        try {
            areMergable = itms.groupBy(isMergeableObject).single().key

        } catch{
            throw Error("cannot merge a mixed collection of mergeable and non-mergable items")
        }
        if (!areMergable) {
            return itms.last()
        }
        switch (numItms) {
            case 0:
                throw Error("can't merge 0 items")
            case 1:
                return itms.single()
            default:
                return entriesToObject(
                    mergeMergeableChildEntries(
                        getLatestEntries(itms),
                        itms))
        }
    }
const isObject = (item: any): boolean => item !== null && typeof item === 'object'

const isMergeableObject = (item: any): boolean => isObject(item) && !Array.isArray(item)

const getLatestEntries = <T, TK extends keyof T, TV extends T[TK], TEntry extends [TK, TV]>(items: Enumerable<T>): Enumerable<TEntry> =>
    //first() is cheap, but last() is expensive
    items
        .reverse() //so it's cheaper to do one reverse() here
        .selectMany(item => entries<T, TK, TV, TEntry>(item))
        .groupBy(([k,]) => k)
        .select(g => g.first()) //than many last() calls here

const mergeMergeableChildEntries = <T, TK extends keyof T, TV extends T[TK]>(entries: Enumerable<[TK, TV]>, items: Enumerable<T>): Enumerable<[TK, TV]> =>
    entries
        .select(([propName, value]): [TK, TV] => [propName, mergeObjectPropertyFromItems(propName, items)]);

const mergeObjectPropertyFromItems = <T, TK extends keyof T, TV extends T[TK]>(propName: TK, items: Enumerable<T>): TV =>
    deepMerge(...items
        .select(i => i[propName] as TV)
        .where(x => typeof x !== 'undefined'))