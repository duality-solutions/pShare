import { createLocalAction } from "../../shared/system/createLocalAction";

test("createLocalAction", () => {
    const ac1 = createLocalAction("actionname")<void>();
    const ac2 = createLocalAction("actionname2")<string>();

    const a1 = ac1() as any;
    const a2 = ac2("monkey") as any;

    expect(a1.type).toBe("actionname")
    expect(a1.meta).toBeDefined()
    expect(a1.meta.scope).toBe("local")
    expect(a1.payload).toBeUndefined()

    expect(a2.type).toBe("actionname2")
    expect(a2.meta).toBeDefined()
    expect(a2.meta.scope).toBe("local")
    expect(a2.payload).toBe("monkey")


})