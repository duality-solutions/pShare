import { createAsyncQueue } from "../../shared/system/createAsyncQueue";
import { createCancellationTokenSource } from "../../shared/system/createCancellationTokenSource";
import { delay } from "../../shared/system/delay";
import { range } from "blinq";

test("AsyncQueue works", async () => {
    const b = createAsyncQueue<number>()
    let resolved = false;
    const p = b.receive().then(a => {
        resolved = true;
        return a
    })

    expect(resolved).not.toBeTruthy()
    b.post(0)

    const val = await p;
    expect(resolved).toBeTruthy()

    expect(val).toBe(0)
})
test("AsyncQueue cancels", async () => {
    const b = createAsyncQueue<number>()
    let resolved = false;
    let cancelled: boolean = false
    const cts = createCancellationTokenSource(500)
    const ct = cts.getToken()
    b.receive(ct)
        .then(a => {
            resolved = true;
            return a
        })
        .catch(e => cancelled = ct.isCancellationRequested)


    await delay(1000)
    expect(resolved).not.toBeTruthy()
    expect(cancelled).toBeTruthy()
})

test("AsyncQueue cancels 2", async () => {
    const b = createAsyncQueue<number>()
    setTimeout(() => b.post(1), 500)
    for (let i = 0; i < 5; ++i) {
        let err: any | undefined = undefined
        try {
            await b.receive(createCancellationTokenSource(1).getToken())
        } catch (e) {
            err = e

        }
        if (!err) {
            throw Error("expected an error")
        }
        expect(/^cancelled$/.test(err.message)).toBeTruthy()

    }
    await delay(1000)
    const r = await b.receive(createCancellationTokenSource(1).getToken())
    expect(r).toBe(1)

})
test("AsyncQueue 2", async () => {
    const b = createAsyncQueue<number>()
    const promises = range(0, 100).select(() => b.receive()).toArray()

    await delay(100)

    range(0, 100).forEach(i => b.post(i))

    const a = await Promise.all(promises)
    expect(a).toEqual(range(0, 100).toArray())

})