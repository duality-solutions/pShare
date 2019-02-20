import { getRandomNames } from "../../shared/system/mockData/getRandomName";

test("namegen", () => {
    expect(getRandomNames(10,"a").join(", ")).toEqual(getRandomNames(10,"a").join(", "))
    expect(getRandomNames(10).join(", ")).not.toEqual(getRandomNames(10).join(", "))
})