import { takeEvery, put, call } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { createValidatedFailurePayload } from "../../shared/system/validator/createValidatedFailurePayload";
import { createValidateFieldPayload } from "../../shared/system/validator/createValidateFieldPayload";
import { createValidatedSuccessPayload } from "../../shared/system/validator/createValidatedSuccessPayload";
import { validationScopes } from "../../renderer/reducers/validationScopes";
import { delay } from "redux-saga";
import { getBitcoinClient } from "../getBitcoinClient";
import BitcoinClient from 'bitcoin-core';
import { SyncState } from "../../dynamicdInterfaces/SyncState";
import { getWalletIsEncrypted } from "./getWalletIsEncrypted";
import { unlockedCommandEffect } from "./effects/unlockedCommandEffect";



export function* setWalletPasswordSaga(mock: boolean = false) {
    yield takeEvery(getType(OnboardingActions.submitPassword), function* (action: ActionType<typeof OnboardingActions.submitPassword>) {
        //spoofing validation actions
        //the validation actions here are not processed by the validationsaga
        //instead we're spoofing actions so that the password page can behave
        //in the same way as, for instance, the username page
        const password = action.payload

        yield put(OnboardingActions.validateField(createValidateFieldPayload(validationScopes.password, "password", password)))
        if (mock) {
            if (action.payload === '666666') {
                yield delay(10000)

                const payload = createValidatedFailurePayload(validationScopes.password, "password", "Could not set password", password, true)

                yield put(OnboardingActions.fieldValidated(payload))
                return
            }
            if (action.payload === '666999') {
                yield delay(10000)

                const payload = createValidatedSuccessPayload(validationScopes.password, "password", password)

                yield put(OnboardingActions.fieldValidated(payload))
                return
            }
        }

        const walletIsEncrypted = yield getWalletIsEncrypted();
        if (walletIsEncrypted) {
            if (mock) {

                const isCorrectPw = yield isCorrectPassword(password)
                if (isCorrectPw) {
                    const payload = createValidatedSuccessPayload(validationScopes.password, "password", action.payload)
                    yield put(OnboardingActions.fieldValidated(payload))
                    yield put(OnboardingActions.setSessionWalletPassword(password))
                    yield put(OnboardingActions.walletPasswordSetSuccess())
                    return
                } else {
                    const payload = createValidatedFailurePayload(validationScopes.password, "password", "Wallet is already encrypted. Could not unlock wallet with supplied password.", password, true)
                    yield put(OnboardingActions.fieldValidated(payload))
                    return
                }
            }
            const payload = createValidatedFailurePayload(validationScopes.password, "password", "Wallet is already encrypted. Please contact support.", password, true)
            yield put(OnboardingActions.fieldValidated(payload))
            return
        }
        yield encryptWallet(password)


        // todo: this takes aaaaages. Skip for now
        // yield waitForSync();

        const payload = createValidatedSuccessPayload(validationScopes.password, "password", action.payload)
        yield put(OnboardingActions.fieldValidated(payload))
        yield put(OnboardingActions.setSessionWalletPassword(password))
        yield put(OnboardingActions.walletPasswordSetSuccess())
    })
}


function isCorrectPassword(password: string) {
    return call(function* () {
        try {
            yield unlockedCommandEffect(password, async () => { })
        } catch (err) {
            if (/^Error\: The wallet passphrase entered was incorrect\.$/.test(err.message)) {
                return false
            }
            throw err;
        }
        return true;
    })
}



function encryptWallet(password: string) {
    return call(function* () {
        const bitcoinClient: BitcoinClient = yield call(() => getBitcoinClient())
        yield call(() => bitcoinClient.command("encryptwallet", password))
        for (; ;) {
            let walletIsEncrypted: boolean;
            try {
                walletIsEncrypted = yield getWalletIsEncrypted()
            } catch{
                walletIsEncrypted = false
            }
            if (walletIsEncrypted) {
                break;
            }
            yield call(() => delay(2000))
        }
    })
}

// @ts-ignore
function waitForSync() {
    return call(function* () {
        const bitcoinClient: BitcoinClient = yield call(() => getBitcoinClient())
        for (; ;) {
            try {
                const syncState: SyncState = yield call(() => bitcoinClient.command("syncstatus"));
                console.log(`sync progress : ${syncState.sync_progress}`)
                if (syncState.sync_progress === 1) {
                    break;
                }
            } catch (err) {
                console.warn("error calling syncstatus", err)
                console.log("waiting 5s")
                yield delay(4000)
            }
            yield delay(1000)
        }

    })
}