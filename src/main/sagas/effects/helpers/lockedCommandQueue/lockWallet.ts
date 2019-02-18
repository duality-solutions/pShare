import { RpcCommandFunc } from "../../../../RpcCommandFunc";
export async function lockWallet(bitcoinCommand: RpcCommandFunc) {
    console.log("locking wallet");
    for (let i = 0; ; ++i) {
        try {
            await bitcoinCommand("walletlock");
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
