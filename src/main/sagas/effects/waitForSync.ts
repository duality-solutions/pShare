import { call } from "redux-saga/effects";
import { delay } from "redux-saga";
import { RpcClient } from "../../RpcClient";
import { SyncState } from "../../../dynamicdInterfaces/SyncState";
export function waitForSync(rpcClient: RpcClient) {
    return call(function* () {
        for (; ;) {

            try {
                const syncState: SyncState = yield call(() => rpcClient.command("syncstatus"));
                console.log(`sync progress : ${syncState.sync_progress}`);
                if (syncState.sync_progress === 1 && syncState.fully_synced) {
                    break;
                }
            }
            catch (err) {

                console.warn("error calling syncstatus", err);
                console.log("waiting 5s");
                yield delay(5000);
                continue
            }
            yield delay(2000);

        }
    });
}
