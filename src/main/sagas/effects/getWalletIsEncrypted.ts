import { call } from "redux-saga/effects";
import { RpcClient } from "../../RpcClient";
import { GetWalletInfo } from "../../../dynamicdInterfaces/GetWalletInfo";
export function getWalletIsEncrypted(rpcClient: RpcClient) {
    return call(function* () {

        const walletInfo: GetWalletInfo = yield call(() => rpcClient.command("getwalletinfo"));
        return (typeof (walletInfo.unlocked_until)) !== 'undefined';
    });
}
