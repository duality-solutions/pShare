import { delay, Channel } from "redux-saga";
import { call, take, race, Pattern } from "redux-saga/effects";
interface TakeBatchOptions {
    minDurationMs: number;
    maxDurationMs?: number;
    maxSize?: number;
}
const defaultTakeBatchOptions: TakeBatchOptions = {
    minDurationMs: 1000,
};
const neverPromise = new Promise<void>(() => {});
const neverEffect = call(() => neverPromise);
export const takeBatch = <T>(
    patOrChan: Pattern | Channel<T>,
    opts: Partial<TakeBatchOptions> = {}
) => {
    const { minDurationMs, maxDurationMs, maxSize } = {
        ...defaultTakeBatchOptions,
        ...opts,
    };
    return call(function*() {
        const receivedEvts: T[] = [];
        const evt: T = yield take(patOrChan as any);
        const batchMaxDelay =
            maxDurationMs != null ? delay(maxDurationMs) : neverEffect;
        receivedEvts.push(evt);
        for (;;) {
            const takeFx = take(patOrChan as any);
            type RaceResult = {
                evt: T;
                nextMessageTimeout: unknown;
                maxTimeout: unknown;
            };
            const {
                evt,
                nextMessageTimeout,
                maxTimeout,
            }: RaceResult = yield race({
                evt: takeFx,
                nextMessageTimeout: delay(minDurationMs),
                maxTimeout: batchMaxDelay,
            });
            if (evt) {
                receivedEvts.push(evt);
            }
            if (
                nextMessageTimeout ||
                (maxSize != null && receivedEvts.length >= maxSize) ||
                maxTimeout
            ) {
                // console.log(`sending batch`, {
                //     evt: !!evt,
                //     nextMessageTimeout: !!nextMessageTimeout,
                //     maxtTimeout: !!maxTimeout,
                //     numMessages: receivedEvts.length,
                // });
                break;
            }
        }
        return receivedEvts;
    });
};
