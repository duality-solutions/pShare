import { RpcCommandFunc } from "../../../../RpcCommandFunc";
import { QueuedCommand } from "../../../../QueuedCommand";
export const runQueuedCommand = async (bitcoinCommand: RpcCommandFunc, { action, promiseResolver: { resolve, reject } }: QueuedCommand): Promise<void> => {
    try {
        resolve(await action(bitcoinCommand));
    }
    catch (err) {
        reject(err);
    }
};
