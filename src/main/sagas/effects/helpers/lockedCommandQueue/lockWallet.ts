import { RpcClient } from "../../../../RpcClient";
export async function lockWallet(client: RpcClient) {
    for (let i = 0; ; ++i) {
        try {
            await client.command("walletlock");
        }
        catch (err) {
            if (/^ETIMEDOUT$/.test(err.message)) {
                if (i < 5) {
                    console.log("timeout waiting for walletlock, trying again");
                    continue;
                }
            }
            throw err;
        }
        break;
    }
    console.warn("wallet locked");
}
