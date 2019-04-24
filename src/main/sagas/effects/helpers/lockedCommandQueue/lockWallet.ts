import { RpcCommandFunc } from "../../../../RpcCommandFunc";
export async function lockWallet(bitcoinCommand: RpcCommandFunc) {
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
            } else {
                console.log("no timeout error : ", err.message)
            }
            throw err;
        }
        break;
    }
    console.warn("wallet locked");
}
