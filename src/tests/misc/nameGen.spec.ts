import { getRandomNames } from "../../shared/system/mockData/getRandomName";
import { randomSample } from "../../shared/system/mockData/randomSample";
import { blinq, range } from "blinq";

test("namegen", () => {
    //console.log(getRandomNames(10, "a"))
    expect(getRandomNames(500000, "a").join(", ")).toEqual(getRandomNames(500000, "a").join(", "))
    expect(getRandomNames(10).join(", ")).not.toEqual(getRandomNames(10).join(", "))
    expect(blinq(getRandomNames(500000)).groupBy(x => x).all(g => g.count() === 1))
})

test("sample", () => {
    expect(blinq(randomSample(100000, 100000)).orderBy(i => i).sequenceEqual(range(0, 100000))).toBeTruthy()
    expect(() => randomSample(4, 5)).toThrow()
})