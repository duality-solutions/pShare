import { RpcCommandFunc } from "../../../RpcCommandFunc";
import { createPromiseResolver } from "../../../../shared/system/createPromiseResolver";
import { getLockedCommandQueue } from "./lockedCommandQueue/getLockedCommandQueue";
import { QueuedCommandWithPassword } from "./lockedCommandQueue/QueuedCommandWithPassword";

export const executeUnlockedCommandAsync = async <T>(walletPassword: string, unlockedAction: (command: RpcCommandFunc) => Promise<T>): Promise<T> => {
    const queueRunner = await getLockedCommandQueue()
    const promiseResolver = createPromiseResolver<T>()
    const queuedCommand: QueuedCommandWithPassword = { action: unlockedAction, promiseResolver, password: walletPassword }
    queueRunner.addQueuedCommand(queuedCommand)
    return promiseResolver.promise
};


// const isWalletUnlocked = async () => {
//     const bitcoinClient = await getBitcoinClient();
//     const walletInfo: GetWalletInfo = await bitcoinClient.command("getwalletinfo")
//     return typeof walletInfo.unlocked_until !== 'undefined' && walletInfo.unlocked_until > 0
// }


