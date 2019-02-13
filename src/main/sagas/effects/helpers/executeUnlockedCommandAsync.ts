import { getBitcoinClient } from "../../../getBitcoinClient";
import { RpcCommandFunc } from "./RpcCommandFunc";
export const executeUnlockedCommandAsync = async <T>(walletPassword: string, unlockedAction: (command: RpcCommandFunc) => Promise<T>) => {
    const bitcoinClient = await getBitcoinClient();
    const bitcoinCommand: RpcCommandFunc = (rpcCommand, ...args) => bitcoinClient.command(rpcCommand, ...args);
    console.log("unlocking wallet");
    await bitcoinCommand("walletpassphrase", walletPassword, 600000); //10mins
    console.warn("wallet unlocked");
    try {
        console.log("invoking unlocked action");
        const result = await unlockedAction(bitcoinCommand);
        console.log("unlocked action invoked");
        return result;
    }
    finally {
        console.log("locking wallet");
        await bitcoinCommand("walletlock");
        console.warn("wallet locked");
    }
};
