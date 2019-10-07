import { call, fork } from "redux-saga/effects";
import { channel, Channel, END, delay, runSaga } from "redux-saga";
import { takeBatch } from "../shared/system/redux-saga/takeBatch";

describe("takeBatch", () => {
    test("maxDurationMs", async () => {
        let theBatch: number[];
        const saga = function*() {
            const chan: Channel<number> = yield call(() => channel<number>());
            yield fork(function*() {
                for (let i = 0; i < 5; ++i) {
                    yield delay(300);
                    yield chan.put(i);
                }
                yield chan.put(END);
            });
            const batch: number[] = yield takeBatch(chan, {
                maxDurationMs: 1000,
                maxSize: 1000,
                minDurationMs: 500,
            });
            theBatch = batch;
        };

        const dispatched: any[] = [];

        const s = runSaga(
            {
                dispatch: action => dispatched.push(action),
                getState: () => ({ value: "test" }),
            },
            saga
        );
        await s.done;
        expect(theBatch!.length).toBe(4);
    });
    test("maxSize", async () => {
        let theBatch: number[];
        const saga = function*() {
            const chan: Channel<number> = yield call(() => channel<number>());
            yield fork(function*() {
                for (let i = 0; i < 4; ++i) {
                    yield delay(300);
                    yield chan.put(i);
                }
                yield chan.put(END);
            });
            const batch: number[] = yield takeBatch(chan, {
                maxDurationMs: 1000000,
                maxSize: 3,
                minDurationMs: 500,
            });
            theBatch = batch;
        };

        const dispatched: any[] = [];

        const s = runSaga(
            {
                dispatch: action => dispatched.push(action),
                getState: () => ({ value: "test" }),
            },
            saga
        );
        await s.done;
        expect(theBatch!.length).toBe(3);
    });
    test("minDuration", async () => {
        let theBatch: number[];
        const saga = function*() {
            const chan: Channel<number> = yield call(() => channel<number>());
            yield fork(function*() {
                for (let i = 0; i < 2; ++i) {
                    yield delay(300);
                    yield chan.put(i);
                }
                yield chan.put(END);
            });
            const batch: number[] = yield takeBatch(chan, {
                maxDurationMs: 1000000,
                maxSize: 3,
                minDurationMs: 200,
            });
            theBatch = batch;
        };

        const dispatched: any[] = [];

        const s = runSaga(
            {
                dispatch: action => dispatched.push(action),
                getState: () => ({ value: "test" }),
            },
            saga
        );
        await s.done;
        expect(theBatch!.length).toBe(1);
    });
});
