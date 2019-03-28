import { RpcCommandFunc } from "../../../../RpcCommandFunc";
export async function unlockWallet(command: RpcCommandFunc, walletPassphrase: string) {
    try {
        await command("walletpassphrase", walletPassphrase, 600000); //10mins
    }
    catch (err) {
        if (!(/^Error\: Wallet is already fully unlocked\.$/.test(err.message))) {
            throw err;
        }
        console.warn("wallet is already unlocked");
    }
    console.warn("wallet unlocked");
}
