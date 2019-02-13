import { call } from "redux-saga/effects";
import { executeUnlockedCommandAsync } from "./helpers/executeUnlockedCommandAsync";
import { RpcCommandFunc } from "./helpers/RpcCommandFunc";

export const unlockedCommandEffect = <T>(walletPassword: string, unlockedAction: (command: RpcCommandFunc) => Promise<T>) =>
    call(() => executeUnlockedCommandAsync(walletPassword, unlockedAction));
