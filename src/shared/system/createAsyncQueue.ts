import { CancellationToken } from "./createCancellationToken";
import { PromiseResolver } from "./PromiseResolver";
import { createPromiseResolver } from "./createPromiseResolver";
import { createQueue } from "./createQueue";


interface AsyncQueue<T> {
    post: (item: T) => void
    receive: (cancellationToken?: CancellationToken) => Promise<T>
}

export const createAsyncQueue = <T>(): AsyncQueue<T> => {
    const items = createQueue<T>()
    const waiting = createQueue<PromiseResolver<T>>()
    const maintainQueues = () => {
        while (waiting.any && items.any) {
            const resolver = waiting.dequeue()
            if (resolver.complete) {
                continue
            }
            const item = items.dequeue()
            resolver.resolve(item)
        }
    }
    return {
        post: (item: T) => {
            items.enqueue(item)
            maintainQueues()
        },
        receive: async (cancellationToken?: CancellationToken): Promise<T> => {
            if (items.any) {
                if (waiting.any) {
                    throw Error("there should not be items when there are waiting resolvers")
                }
                return items.dequeue()
            }
            const promiseResolver = createPromiseResolver<T>()
            if (typeof cancellationToken !== 'undefined') {
                cancellationToken.register(err => promiseResolver.cancel())
            }
            waiting.enqueue(promiseResolver)
            return promiseResolver.promise
        }
    }
}