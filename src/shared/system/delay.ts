import { CancellationToken } from "./createCancellationToken";

export const delay = (time: number, cancellationToken?: CancellationToken) => {



    return new Promise((resolve,reject) => {
        if (cancellationToken && cancellationToken.isCancellationRequested) {
            reject(Error("operation was cancelled"))
            return;
        }
        cancellationToken && cancellationToken.register(() => reject(Error("operation was cancelled")))
        return setTimeout(resolve, time);
    });
}