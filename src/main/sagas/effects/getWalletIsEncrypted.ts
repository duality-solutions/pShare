import { call } from "redux-saga/effects";
import { getRpcClient } from "../../getRpcClient";
import { RpcClient } from "../../RpcClient";
import { GetWalletInfo } from "../../../dynamicdInterfaces/GetWalletInfo";
export function getWalletIsEncrypted() {
    return call(function* () {
        const bitcoinClient: RpcClient = yield call(() => getRpcClient());
        const walletInfo: GetWalletInfo = yield call(() => bitcoinClient.command("getwalletinfo"));
        return (typeof (walletInfo.unlocked_until)) !== 'undefined';
    });
}
