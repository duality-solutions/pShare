import { nameData } from "./nameData";
import { range, blinq } from "blinq";
import * as seedrandom from 'seedrandom'

export const getRandomNames = (count: number, seed?: string) => {
    const femaleNames = nameData.firstnames.female
    const maleNames = nameData.firstnames.male
    const lastNames = nameData.surnames

    const allFirstNames = blinq(femaleNames).concat(maleNames).toArray()

    var rng = seedrandom(seed);

    let names: string[] = [];
    while (names.length !== count) {
        const remainingNames = count - (names.length)

        names = range(0, remainingNames)
            .select(() => `${allFirstNames[(rng() * allFirstNames.length) >> 0]} ${lastNames[(rng() * lastNames.length) >> 0]}`)
            .concat(names)
            .toArray()
    }
    return names
}