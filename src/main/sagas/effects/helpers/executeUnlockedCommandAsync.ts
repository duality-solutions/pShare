import { RpcCommandFunc } from "./RpcCommandFunc";
import { createPromiseResolver } from "../../../../shared/system/createPromiseResolver";
import { getLockedCommandQueue } from "./lockedCommandQueue/getLockedCommandQueue";
import { QueuedCommand } from "./lockedCommandQueue/QueuedCommand";

export const executeUnlockedCommandAsync = async <T>(walletPassword: string, unlockedAction: (command: RpcCommandFunc) => Promise<T>): Promise<T> => {
    const queueRunner = await getLockedCommandQueue()
    const promiseResolver = createPromiseResolver<T>()
    const queuedCommand: QueuedCommand = { action: unlockedAction, promiseResolver }
    queueRunner.addQueuedCommand(walletPassword, queuedCommand)
    return promiseResolver.promise
};


// const isWalletUnlocked = async () => {
//     const bitcoinClient = await getBitcoinClient();
//     const walletInfo: GetWalletInfo = await bitcoinClient.command("getwalletinfo")
//     return typeof walletInfo.unlocked_until !== 'undefined' && walletInfo.unlocked_until > 0
// }


