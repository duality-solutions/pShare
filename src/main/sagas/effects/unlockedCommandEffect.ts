import { call } from "redux-saga/effects";
import { executeUnlockedCommandAsync } from "./helpers/executeUnlockedCommandAsync";
import { RpcCommandFunc } from "../../RpcCommandFunc";
import { getWalletPassphrase } from "./getWalletPassphrase";
import { RpcClient } from "../../../main/RpcClient";

export const unlockedCommandEffect = <T>(rpcClient: RpcClient, unlockedAction: (command: RpcCommandFunc) => Promise<T>) =>
    call(function* () {
        const walletPassphrase = yield getWalletPassphrase()
        return yield call(() => executeUnlockedCommandAsync(rpcClient, walletPassphrase, unlockedAction))
    });
