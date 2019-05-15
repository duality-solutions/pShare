import { RpcClient } from "../RpcClient";
import { takeEvery, call, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { delay } from "redux-saga";
import { SyncState } from "../../dynamicdInterfaces/SyncState";
import { round } from "./initializationSaga/round";
import { SyncActions } from "../../shared/actions/sync";
import { BdapAccount } from "../../dynamicdInterfaces/BdapAccount";
import { getFirstBdapAccount } from "./helpers/getFirstBdapAccount";

const round0 = round(0)


export function* restoreFromMnemonicSaga(client: RpcClient) {
    yield takeEvery(getType(OnboardingActions.mnemonicSubmittedForRestore), function* ({ payload: mnemonic }: ActionType<typeof OnboardingActions.mnemonicSubmittedForRestore>) {

        yield call(() => client.command("importmnemonic", mnemonic))
        yield put(OnboardingActions.restoring())
        let currentCompletionPercent: number = -1000;

        for (; ;) {
            let syncState: SyncState;
            try {
                // fetch the state from dynamicd
                syncState = yield call(() => client.command({ timeout: 5000 }, "syncstatus"));
            }
            catch (e) {
                // oh no, something bad
                console.log("an error occurred when querying syncstatus", e);
                // wait 5s
                yield call(delay, 5000);
                // try again
                continue;
            }

            const currentVerificationProgress = round0(syncState.sync_progress * 100)
            const completionPercent: number = currentVerificationProgress;
            if (completionPercent !== currentCompletionPercent) {
                currentCompletionPercent = completionPercent
                yield put(SyncActions.syncProgress({ completionPercent }));
            }
            // dispatch a "sync/PROGRESS" action



            // if we've hit 100%, we're done
            if (currentCompletionPercent === 100 && syncState.fully_synced) {
                // complete
                break;
            }

            //wait, then go again
            yield call(delay, 1000);
        }
        let bdapAccount: BdapAccount | undefined
        try {
            bdapAccount = yield getFirstBdapAccount(client)
        }
        catch (err) {
            yield put(OnboardingActions.restoreFailed("account contains many bdap users"))
            return
        }
        if (!bdapAccount) {
            yield put(OnboardingActions.restoreFailed("could not find bdap user"))
            return
        }
        yield put(OnboardingActions.restoreSuccess(bdapAccount.object_id))
    })
}

