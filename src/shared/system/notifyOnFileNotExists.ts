import { CancellationToken, createCancellationTokenSource } from './createCancellationTokenSource';
import { delay } from './delay';
import { fileExists } from './fileExists';
export const notifyOnFileNotExists = async (filepath: string, callback: () => Promise<void>, cancellationToken?: CancellationToken) => {
    var ct = cancellationToken || createCancellationTokenSource().getToken();
    while (!ct.isCancellationRequested) {
        const exists = await fileExists(filepath);
        if (!exists && !ct.isCancellationRequested) {
            console.warn(`${filepath} does not exist, notifying`);
            await callback();
        }
        try {
            await delay(1000, ct);
        }
        catch {
            break;
        }
    }
};
