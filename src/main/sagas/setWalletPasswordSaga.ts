import { takeEvery, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { createValidatedFailurePayload } from "../../shared/system/validator/createValidatedFailurePayload";
import { createValidateFieldPayload } from "../../shared/system/validator/createValidateFieldPayload";
import { createValidatedSuccessPayload } from "../../shared/system/validator/createValidatedSuccessPayload";
import { validationScopes } from "../../renderer/reducers/validationScopes";
import { delay } from "redux-saga";



export function* setWalletPasswordSaga(mock: boolean = false) {
    yield takeEvery(getType(OnboardingActions.submitPassword), function* (action: ActionType<typeof OnboardingActions.submitPassword>) {

        yield put(OnboardingActions.validateField(createValidateFieldPayload(validationScopes.password, "password", action.payload)))
        yield delay(3000)
        if (action.payload === '666666') {
            const payload = createValidatedFailurePayload(validationScopes.password, "password", "Could not set password", action.payload, true)

            yield put(OnboardingActions.fieldValidated(payload))
        }
        else {
            const payload = createValidatedSuccessPayload(validationScopes.password, "password", action.payload)
            yield put(OnboardingActions.fieldValidated(payload))
            yield put(OnboardingActions.walletPasswordSet())

        }
    })
}

