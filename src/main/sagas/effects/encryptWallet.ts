import { call } from "redux-saga/effects";
import { delay } from "redux-saga";
import { getBitcoinClient } from "../../getBitcoinClient";
import BitcoinClient from 'bitcoin-core';
import { getWalletIsEncrypted } from "../getWalletIsEncrypted";
export function encryptWallet(password: string) {
    return call(function* () {
        const bitcoinClient: BitcoinClient = yield call(() => getBitcoinClient());
        yield call(() => bitcoinClient.command("encryptwallet", password));
        for (; ;) {
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
