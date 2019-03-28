import { RpcCommandFunc } from "../../../../RpcCommandFunc";
import { QueuedCommand } from "../../../../QueuedCommand";
export const runQueuedCommand = async (command: RpcCommandFunc, { action, promiseResolver: { resolve, reject } }: QueuedCommand): Promise<void> => {
    try {
        resolve(await action(command));
    }
    catch (err) {
        reject(err);
    }
};
