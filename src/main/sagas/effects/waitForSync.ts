import { call } from "redux-saga/effects";
import { delay } from "redux-saga";
import { getBitcoinClient } from "../../getBitcoinClient";
import BitcoinClient from 'bitcoin-core';
import { SyncState } from "../../../dynamicdInterfaces/SyncState";
export function waitForSync() {
    return call(function* () {
        const bitcoinClient: BitcoinClient = yield call(() => getBitcoinClient());
        for (; ;) {
            try {
                const syncState: SyncState = yield call(() => bitcoinClient.command("syncstatus"));
                console.log(`sync progress : ${syncState.sync_progress}`);
                if (syncState.sync_progress === 1) {
                    break;
                }
            }
            catch (err) {
                console.warn("error calling syncstatus", err);
                console.log("waiting 5s");
                yield delay(4000);
            }
            yield delay(1000);
        }
    });
}
