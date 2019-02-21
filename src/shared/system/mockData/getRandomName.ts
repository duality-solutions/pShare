import { nameData } from "./nameData";
import { randomSample } from "./randomSample";

export const getRandomNames = (count: number, seed?: string) => {
    const femaleNames = nameData.firstnames.female
    const maleNames = nameData.firstnames.male
    const lastNames = nameData.surnames

    const allFirstNames = femaleNames.concat(maleNames)

    const indexToName = (idx: number) => `${allFirstNames[(idx / lastNames.length) >> 0]} ${lastNames[idx % lastNames.length]}`
    const totalIndexes = lastNames.length * allFirstNames.length

    if (count > totalIndexes) {
        throw Error(`can only generate up to ${totalIndexes} unique names`)
    }

    return randomSample(totalIndexes, count, seed).map(indexToName)
}
