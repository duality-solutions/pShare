import { createCancellationToken } from "../../shared/system/createCancellationToken";
test("isCancellationRequested", () => {
    const ct = createCancellationToken()
    expect(ct.isCancellationRequested).toBe(false)
    ct.cancel()
    expect(ct.isCancellationRequested).toBe(true)
})
test("isCancellationRequested is get only", () => {
    const ct: any = createCancellationToken()
    expect(ct.isCancellationRequested).toBe(false)
    expect(() => ct.isCancellationRequested = true).toThrow()
})
test("register", done => {
    const ct = createCancellationToken()
    ct.register(_ => done())
    ct.cancel()
})
test("createDependentToken", done => {
    const ct = createCancellationToken()
    const dt = ct.createDependentToken()
    const et = dt.createDependentToken()
    et.register(_ => done())
    ct.cancel()
})
