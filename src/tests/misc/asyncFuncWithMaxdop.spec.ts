import { delay } from "../../shared/system/delay";
import { asyncFuncWithMaxdop } from "../../shared/system/asyncFuncWithMaxdop";
import { range } from "blinq";

describe("asyncFuncWithMaxdop", () => {
    test("asyncFuncWithMaxdop", async () => {

        const f = async () => {
            await delay(1000)
        }
        const fw = asyncFuncWithMaxdop(f, 20)
        let finished = false;

        Promise.all(range(0, 40).select(() => fw())).then(() => finished = true)
        await delay(1250)

        expect(finished).toBeFalsy()
        await delay(1000)
        expect(finished).toBeTruthy()

        finished = false;
        const fw2 = asyncFuncWithMaxdop(f, 40)
        Promise.all(range(0, 40).select(() => fw2())).then(() => finished = true)
        await delay(750)

        expect(finished).toBeFalsy()
        await delay(500)
        expect(finished).toBeTruthy()

        finished = false;
        const fw3 = asyncFuncWithMaxdop(f, 10)
        Promise.all(range(0, 40).select(() => fw3())).then(() => finished = true)
        await delay(2250)

        expect(finished).toBeFalsy()
        await delay(1000)
        expect(finished).toBeFalsy()
        await delay(1000)
        expect(finished).toBeTruthy()

    }, 15000)
})
