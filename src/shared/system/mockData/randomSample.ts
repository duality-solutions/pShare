import * as seedrandom from "seedrandom";

export function randomSample(totalItems: number, sampleSize: number, seed?: string) {
    // https://math.stackexchange.com/questions/178690/whats-the-proof-of-correctness-for-robert-floyds-algorithm-for-selecting-a-sin    
    var rng = seedrandom(seed);
    var n = totalItems;
    if (sampleSize > n) {
        throw Error("arguments");
    }
    var sampleList = new Set<number>();
    for (var i = n - sampleSize; i < n; i++) {
        var item = (rng() * i) >> 0;
        if (sampleList.has(item))
            sampleList.add(i);
        else
            sampleList.add(item);
    }
    return [...sampleList];
}
