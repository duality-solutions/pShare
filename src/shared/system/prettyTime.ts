import { blinq } from "blinq";

type TimeInterval = "s" | "m" | "h" | "d" | "wk";
interface IntervalDescription {
    label: TimeInterval;
    interval: number | null;
}

export const prettyTime = (() => {
    const intervals: IntervalDescription[] = [
        { label: "s", interval: 60 },
        { label: "m", interval: 60 },
        { label: "h", interval: 24 },
        { label: "d", interval: 7 },
        { label: "wk", interval: null }
    ];
    const bIntervals = blinq(intervals);

    const pt = (secs: number) => {
        const isNegative = secs < 0;
        secs = Math.abs(secs);
        const agg = bIntervals.aggregate(
            { parts: [] as (string | null)[], rem: secs },
            (acc, curr) => {
                const v = curr.interval
                    ? (acc.rem | 0) % curr.interval
                    : acc.rem | 0;
                const vs = v > 0 ? `${v}${curr.label}` : null;
                const r = acc.rem / (curr.interval == null ? 1 : curr.interval);
                return { parts: [...acc.parts, vs], rem: r };
            }
        );
        const parts = blinq(agg.parts)
            .reverse()
            .where(s => s != null)
            .toArray();
        const absPretty = parts.length === 0 ? "0s" : parts.join(" ");

        return `${isNegative ? "-" : ""}${absPretty}`;
    };
    return pt;
})();
