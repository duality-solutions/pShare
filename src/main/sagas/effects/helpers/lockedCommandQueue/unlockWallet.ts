import { RpcClient } from "../../../../RpcClient";
export async function unlockWallet(client: RpcClient, walletPassphrase: string) {
    try {
        await client.command("walletpassphrase", walletPassphrase, 600000); //10mins
    }
    catch (err) {
        if (!(/^Error\: Wallet is already fully unlocked\.$/.test(err.message))) {
            throw err;
        }
        console.warn("wallet is already unlocked");
    }
    console.warn("wallet unlocked");
}
