import { isPromise } from "../isPromise";
import { call } from "redux-saga/effects";

export const resourceScope = <T>(
    factory: (() => T | Promise<T>) | T,
    cleanup: (item: T) => void | Promise<void> | IterableIterator<any>
): ResourceScope<T> => {
    return {
        *use(
            action: (item: T) => IterableIterator<any> | Promise<void> | void
        ) {
            let item: T;
            if (typeof factory === "function") {
                const itemOrPromise = (factory as (() => T | Promise<T>))();
                if (isPromise(itemOrPromise)) {
                    item = yield call(() => itemOrPromise);
                } else {
                    item = itemOrPromise as T;
                }
            } else {
                item = factory;
            }

            try {
                const actionResult = action(item);
                if (isPromise(actionResult)) {
                    yield call(() => actionResult);
                } else if ((actionResult as any)[Symbol.iterator]) {
                    yield* actionResult as IterableIterator<any>;
                }
            } catch (ex) {
                console.log("Use threw :", ex);
                throw ex;
            } finally {
                const pp = cleanup(item);
                if (pp) {
                    if (isPromise(pp)) {
                        yield call(() => pp);
                    } else if ((pp as any)[Symbol.iterator]) {
                        yield* pp as IterableIterator<any>;
                    }
                }
            }
        },
    };
};
export interface ResourceScope<T> {
    use(
        action: (item: T) => IterableIterator<any> | Promise<void> | void
    ): IterableIterator<any>;
}
