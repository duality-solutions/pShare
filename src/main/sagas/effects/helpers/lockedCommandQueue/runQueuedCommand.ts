import { QueuedCommand } from "../../../../QueuedCommand";
import { RpcClient } from "../../../../RpcClient";
export const runQueuedCommand = async (client: RpcClient, { action, promiseResolver: { resolve, reject } }: QueuedCommand): Promise<void> => {
    try {
        resolve(await action(client));
    }
    catch (err) {
        reject(err);
    }
};
