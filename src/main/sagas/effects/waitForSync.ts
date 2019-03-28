import { call } from "redux-saga/effects";
import { delay } from "redux-saga";
import { RpcClient } from "../../RpcClient";
import { SyncState } from "../../../dynamicdInterfaces/SyncState";
import { CancellationToken } from "../../../shared/system/createCancellationToken";
export function waitForSync(rpcClient: RpcClient,cancellationToken: CancellationToken) {
    return call(function* () {
        while (!cancellationToken.isCancellationRequested) {
            try {
                try {
                    const syncState: SyncState = yield call(() => rpcClient.command("syncstatus"));
                    console.log(`sync progress : ${syncState.sync_progress}`);
                    if (syncState.sync_progress === 1) {
                        break;
                    }
                }
                catch (err) {
                    if (cancellationToken.isCancellationRequested) {
                        break;
                    }
                    console.warn("error calling syncstatus", err);
                    console.log("waiting 5s");
                    yield delay(4000, cancellationToken);
                }
                yield delay(1000, cancellationToken);
            } catch (err) {
                if (cancellationToken.isCancellationRequested) {
                    break;
                }
                else {
                    throw err
                }
            }
        }
    });
}
