import { call } from "redux-saga/effects";
import { executeUnlockedCommandAsync } from "./helpers/executeUnlockedCommandAsync";
import { RpcClient } from "../../../main/RpcClient";
export function isCorrectPassword(rpcClient: RpcClient, password: string) {
    return call(function* () {
        try {
            yield call(function* () {
                return executeUnlockedCommandAsync(rpcClient, password, async () => { })
            });
        }
        catch (err) {
            if (/^Error\: The wallet passphrase entered was incorrect\.$/.test(err.message)) {
                return false;
            }
            throw err;
        }
        return true;
    });
}
