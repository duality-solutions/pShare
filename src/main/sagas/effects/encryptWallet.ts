import { call } from "redux-saga/effects";
import { getRpcClient } from "../../getRpcClient";
import { RpcClient } from "../../RpcClient";
import { getWalletIsEncrypted } from "../getWalletIsEncrypted";
import { delay } from "../../../shared/system/delay";
export function encryptWallet(password: string) {
    return call(function* () {
        const bitcoinClient: RpcClient = yield call(() => getRpcClient());
        yield call(() => bitcoinClient.command("encryptwallet", password));
        while (true) {
            let walletIsEncrypted: boolean;
            try {
                walletIsEncrypted = yield getWalletIsEncrypted();
            }
            catch {
                walletIsEncrypted = false;
            }
            if (walletIsEncrypted) {
                break;
            }
            yield call(() => delay(2000));
        }
    });
}
