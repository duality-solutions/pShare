import { takeEvery, put } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
//import { delay } from "redux-saga";
import { createValidatedFailurePayload } from "../../shared/system/createValidatedFailurePayload";
import { validationScopes } from "../../renderer/reducers/validationScopes";



export function* setWalletPasswordSaga(mock: boolean = false) {
    yield takeEvery(getType(OnboardingActions.submitPassword), function* (action: ActionType<typeof OnboardingActions.submitPassword>) {
        //console.log("received submitPassword")
        //yield delay(5000);
        //console.log("putting walletPasswordSet")
        if (action.payload === '666666') {
            const payload = createValidatedFailurePayload(validationScopes.password, "password", "Could not set password", action.payload, true)

            yield put(OnboardingActions.fieldValidated(payload))
        }
        else {
            yield put(OnboardingActions.walletPasswordSet())

        }
    })
}