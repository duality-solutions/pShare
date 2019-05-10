import { takeEvery, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { createValidatedFailurePayload } from "../../shared/system/validator/createValidatedFailurePayload";
import { createValidateFieldPayload } from "../../shared/system/validator/createValidateFieldPayload";
import { createValidatedSuccessPayload } from "../../shared/system/validator/createValidatedSuccessPayload";
import { validationScopes } from "../../renderer/reducers/validationScopes";
import { delay } from "redux-saga";
import { getWalletIsEncrypted } from "./effects/getWalletIsEncrypted";
import { encryptWallet } from "./effects/encryptWallet";
import { isCorrectPassword } from "./effects/isCorrectPassword";
import { RpcClientWrapper } from "../RpcClient";
import { waitForSync } from "./effects/waitForSync";



export function* setWalletPasswordSaga(rpcClient: RpcClientWrapper, mock: boolean = false) {
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

        const walletIsEncrypted = yield getWalletIsEncrypted(rpcClient);
        if (walletIsEncrypted) {
            if (mock) {

                const isCorrectPw = yield isCorrectPassword(rpcClient, password)
                if (isCorrectPw) {
                    const payload = createValidatedSuccessPayload(validationScopes.password, "password", action.payload)
                    yield put(OnboardingActions.fieldValidated(payload))
                    yield put(OnboardingActions.setSessionWalletPassword(password))
                    yield put(OnboardingActions.walletPasswordSetSuccess())
                    return
                } else {
                    const payload = createValidatedFailurePayload(validationScopes.password, "password", "The supplied credentials are incorrect.", password, true)
                    yield put(OnboardingActions.fieldValidated(payload))
                    return
                }
            }
            const payload = createValidatedFailurePayload(validationScopes.password, "password", "Wallet is already encrypted. Please contact support.", password, true)
            yield put(OnboardingActions.fieldValidated(payload))
            return
        }
        yield encryptWallet(rpcClient, password)

        yield waitForSync(rpcClient);

        const payload = createValidatedSuccessPayload(validationScopes.password, "password", action.payload)
        yield put(OnboardingActions.fieldValidated(payload))
        yield put(OnboardingActions.setSessionWalletPassword(password))
        yield put(OnboardingActions.walletPasswordSetSuccess())
    })
}
