import { RpcCommandFunc } from "../RpcCommandFunc";
export async function unlockWallet(bitcoinCommand: RpcCommandFunc, walletPassphrase: string) {
    console.log("unlocking wallet");
    try {
        await bitcoinCommand("walletpassphrase", walletPassphrase, 600000); //10mins
    }
    catch (err) {
        if (!(/^Error\: Wallet is already fully unlocked\.$/.test(err.message))) {
            throw err;
        }
        console.warn("wallet is already unlocked");
    }
    console.warn("wallet unlocked");
}
