import { RpcClient } from "../../../../RpcClient";
export async function lockWallet(client: RpcClient) {
    for (let i = 0; ; ++i) {
        try {
            await client.command("walletlock");
        }
        catch (err) {
            if (/(^ETIMEDOUT$)|(^socket hang up$)/.test(err.message)) {
                if (i < 5) {
                    console.log("timeout/hangup waiting for walletlock, trying again");
                    continue;
                }
            } else {
                console.log("no timeout error : ", err.message, err)
            }
            throw err;
        }
        break;
    }
    console.warn("wallet locked");
}
