import { deleteOptionalProperty } from "../../shared/system/deleteOptionalProperty";

interface A {
    one: string;
    two?: string;
}

test("deleteOptionalProperty works", () => {
    const a: A = { one: "1", two: "2" }
    const b: A = deleteOptionalProperty(a, "two")
    expect(typeof b.two).toBe('undefined')
    expect(b).toEqual({ one: "1" })
})