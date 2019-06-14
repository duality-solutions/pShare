import { deleteOptionalProperty, deleteOptionalProperties } from "../../shared/system/deleteOptionalProperty";

interface A {
    one: string
    two?: string
    three?: string
}

test("deleteOptionalProperty works", () => {
    const a: A = { one: "1", two: "2", three: "3" }
    const b: A = deleteOptionalProperty(a, "two")
    expect(typeof b.two).toBe('undefined')
    expect(b).toEqual({ one: "1", three: "3" })
})
test("deleteOptionalProperties works", () => {
    const a: A = { one: "1", two: "2", three: "3" }
    expect(typeof a.two).not.toBe('undefined')
    expect(typeof a.three).not.toBe('undefined')
    const b: A = deleteOptionalProperties(a, "two", "three")
    expect(typeof b.two).toBe('undefined')
    expect(typeof b.three).toBe('undefined')
    expect(b).toEqual({ one: "1" })
})