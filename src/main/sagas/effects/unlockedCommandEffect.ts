import { call } from "redux-saga/effects";
import { executeUnlockedCommandAsync } from "./helpers/executeUnlockedCommandAsync";
import { getWalletPassphrase } from "./getWalletPassphrase";
import { RpcClient } from "../../../main/RpcClient";

export const unlockedCommandEffect = <T>(rpcClient: RpcClient, unlockedAction: (client: RpcClient) => Promise<T>) =>
    call(function* () {
        const walletPassphrase = yield getWalletPassphrase()
        return yield call(() => executeUnlockedCommandAsync(rpcClient, walletPassphrase, unlockedAction))
    });
