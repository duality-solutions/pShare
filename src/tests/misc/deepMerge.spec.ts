import { deepMerge } from "../../shared/system/deepMerge";
// import { blinq } from "blinq";
// import { Enumerable } from "blinq/dist/types/src/Enumerable";
interface B {
    c: number
    d: string
}
interface A {
    a: number
    b: Partial<B>
    e: boolean
}


test("misc", () => {
    const a: A = { a: 1, b: { c: 2, d: "foo" }, e: false }
    const b: Partial<A> = { e: true }
    const c: Partial<A> = { a: 2 }

    const merged = deepMerge(a, b, c)

    expect(merged).not.toBe(a)
    expect(merged).not.toBe(b)
    expect(merged).not.toBe(c)

    expect(merged).toEqual({ a: 2, b: { c: 2, d: "foo" }, e: true })
    const d: Partial<A> = { b: { d: "woo" } }
    const merged2 = deepMerge(a, d, b, c)
    expect(merged2).toEqual({ a: 2, b: { c: 2, d: "woo" }, e: true })
    const e: Partial<A> = { b: { d: "doo" } }
    const merged3 = deepMerge(a, d, b, c, e)
    expect(merged3).toEqual({ a: 2, b: { c: 2, d: "doo" }, e: true })
    const merged4 = deepMerge(a, b, c, e, d)
    expect(merged4).toEqual({ a: 2, b: { c: 2, d: "woo" }, e: true })


    expect(deepMerge(
        {
            b: 3,
            c: 5
        },
        {
            a: 1,
            b: 2,
            cx: {
                x: 55,
                y: 66
            }
        },
        {
            cx: {
                x: 77
            }
        }))
        .toEqual({
            a: 1,
            b: 2,
            c: 5,
            cx: {
                x: 77,
                y: 66
            }
        })
})
test("reuses equal structures", () => {
    const zz = { zz: 11 }

    expect(deepMerge(zz, zz)).toBe(zz)
})
test("deep reuses equal structures", () => {

    const zz = { zz: 11 }
    const aa = { a: 1, z: zz }
    const bb = { a: 2, z: zz }
    const cc = deepMerge(aa, bb)
    expect(cc.z).toBe(zz)
})

test("throws with no params", () => expect(() => deepMerge()).toThrow())
test("treats arrays as unmergeable", () => expect(deepMerge([1, 2], [3, 4])).toEqual([3, 4]))
test("treats numbers as unmergeable", () => expect(deepMerge(1, 2)).toEqual(2))
test("throws with mixed mergeable/unmergeable items", () => expect(() => deepMerge({ a: 1 }, 2 as any)).toThrow())
test("throws with mixed mergeable/unmergeable items, deep in graph", () => expect(() => deepMerge({ a: { b: 2 } }, { a: 1 })).toThrow())