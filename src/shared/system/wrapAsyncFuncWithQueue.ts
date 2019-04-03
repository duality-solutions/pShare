import { PromiseResolver } from "./PromiseResolver";
import { createPromiseResolver } from "./createPromiseResolver";
import { createQueue } from "./createQueue";
export function wrapAsyncFuncWithQueue<T extends (...args: any[]) => Promise<TP>, TP = void>(func: T) {
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
            const [args, resolver] = msg;
            try {
                const v = await func(...args);
                resolver.resolve(v);
            }
            catch (error) {
                resolver.reject(error);
            }
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
