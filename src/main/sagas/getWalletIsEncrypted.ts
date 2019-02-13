import { call } from "redux-saga/effects";
import { getBitcoinClient } from "../getBitcoinClient";
import { GetWalletInfo } from "../../dynamicdInterfaces/GetWalletInfo";
import BitcoinClient from 'bitcoin-core';
export function getWalletIsEncrypted() {
    return call(function* () {
        const bitcoinClient: BitcoinClient = yield call(() => getBitcoinClient());
        const walletInfo: GetWalletInfo = yield call(() => bitcoinClient.command("getwalletinfo"));
        return (typeof (walletInfo.unlocked_until)) !== 'undefined';
    });
}
