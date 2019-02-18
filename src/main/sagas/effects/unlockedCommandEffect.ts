import { call } from "redux-saga/effects";
import { executeUnlockedCommandAsync } from "./helpers/executeUnlockedCommandAsync";
import { RpcCommandFunc } from "../../RpcCommandFunc";

export const unlockedCommandEffect = <T>(walletPassword: string, unlockedAction: (command: RpcCommandFunc) => Promise<T>) =>
    call(() => executeUnlockedCommandAsync(walletPassword, unlockedAction));
