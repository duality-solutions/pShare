import { PromiseResolver } from "./PromiseResolver";
import { createPromiseResolver } from "./createPromiseResolver";
import { createQueue } from "./createQueue";
import { createAsyncQueue } from "./createAsyncQueue";
export function asyncFuncWithMaxdop<T extends (...args: any[]) => Promise<TP>, TP = void>(func: T, maxDop: number = 1) {
    const dopTokens = createAsyncQueue<{}>()
    for (var i = 0; i < maxDop; ++i) {
        dopTokens.post({})
    }
    const q = createQueue<[Parameters<T>, PromiseResolver<TP>]>();
    let queueRunning = false;
    const runQueue = async () => {
        if (queueRunning) {
            return;
        }
        queueRunning = true;
        while (q.any) {
            let msg: [Parameters<T>, PromiseResolver<TP>];
            try {
                msg = q.dequeue();
            }
            catch (error) {
                break;
            }
            const dopToken = await dopTokens.receive()
            const [args, resolver] = msg;
            resolveFunction<T, TP>(func, args, resolver)
                .catch(e => {
                    dopTokens.post(dopToken)
                    throw e
                }).then(v => {
                    dopTokens.post(dopToken)
                    return v
                });
        }
        queueRunning = false;
    };
    return async (...args: Parameters<T>) => {
        const r = createPromiseResolver<TP>();
        q.enqueue([args, r]);
        runQueue();
        return r.promise;
    };
}
async function resolveFunction<T extends (...args: any[]) => Promise<TP>, TP = void>(func: T, args: Parameters<T>, resolver: PromiseResolver<TP>) {
    try {
        const v = await func(...args);
        resolver.resolve(v);
    }
    catch (error) {
        resolver.reject(error);
    }
}

