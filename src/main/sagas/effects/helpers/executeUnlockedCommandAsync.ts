import { getBitcoinClient } from "../../../getBitcoinClient";
import { RpcCommandFunc } from "./RpcCommandFunc";
export const executeUnlockedCommandAsync = async <T>(walletPassword: string, unlockedAction: (command: RpcCommandFunc) => Promise<T>) => {
    const bitcoinClient = await getBitcoinClient();
    const bitcoinCommand: RpcCommandFunc = (rpcCommand, ...args) => bitcoinClient.command(rpcCommand, ...args);
    console.log("unlocking wallet");
    try {
        await bitcoinCommand("walletpassphrase", walletPassword, 600000); //10mins
    } catch (err) {
        if (!(/^Error\: Wallet is already fully unlocked\.$/.test(err.message))) {
            throw err
        }
        console.warn("wallet is already unlocked")
    }
    console.warn("wallet unlocked");
    try {
        console.log("invoking unlocked action");
        const result = await unlockedAction(bitcoinCommand);
        console.log("unlocked action invoked");
        return result;
    }
    finally {
        console.log("locking wallet");
        for (let i = 0; ; ++i) {
            try {
                await bitcoinCommand("walletlock");
            } catch (err) {
                if (/^ETIMEDOUT$/.test(err.message)) {
                    if (i < 5) {
                        console.log("timeout waiting for walletlock, trying again")
                        continue;
                    }

                }
                throw err
            }
            break;
        }
        console.warn("wallet locked");
    }
};
