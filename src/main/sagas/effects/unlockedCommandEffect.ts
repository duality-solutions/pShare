import { call } from "redux-saga/effects";
import { executeUnlockedCommandAsync } from "./helpers/executeUnlockedCommandAsync";
import { RpcCommandFunc } from "../../RpcCommandFunc";
import { getWalletPassphrase } from "./getWalletPassphrase";

export const unlockedCommandEffect = <T>(unlockedAction: (command: RpcCommandFunc) => Promise<T>) =>
    call(function* () {
        const walletPassphrase = yield getWalletPassphrase()
        return executeUnlockedCommandAsync(walletPassphrase, unlockedAction)
    });
