import { call } from "redux-saga/effects";
import { getRpcClient } from "../../getRpcClient";
import { RpcClientWrapper } from "../../RpcClient";
import { getWalletIsEncrypted } from "../getWalletIsEncrypted";
import { delay } from "../../../shared/system/delay";
import { createPromiseResolver } from "../../../shared/system/createPromiseResolver";
export function encryptWallet(password: string) {
    return call(function* () {
        const rpcClient: RpcClientWrapper = yield call(() => getRpcClient());
        yield* encryptWalletAndWaitForRestart(rpcClient, password);

        while (true) {
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
function* encryptWalletAndWaitForRestart(rpcClient: RpcClientWrapper, password: string) {
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isDevelopment) {
        const promiseResolver = createPromiseResolver<void>();
        const handler: (evtObj: any) => void = e => promiseResolver.resolve();
        rpcClient.processInfo.addEventListener("restart", handler);

        yield call(() => rpcClient.command("encryptwallet", password));

        console.log("restart expected. waiting for restart event");
        yield call(async () => {
            await promiseResolver.promise;
        });
        console.log("rpcClient processInfo indicated a restart. safe to continue");
        rpcClient.processInfo.removeEventListener("restart", handler);
    } else {
        yield call(() => rpcClient.command("encryptwallet", password));
        yield call(() => delay(5000))
    }


}

