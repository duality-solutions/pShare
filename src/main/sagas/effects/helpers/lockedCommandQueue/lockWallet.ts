import { RpcCommandFunc } from "../../../../RpcCommandFunc";
export async function lockWallet(rpcCommand: RpcCommandFunc) {
    for (let i = 0; ; ++i) {
        try {
            await rpcCommand("walletlock");
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
