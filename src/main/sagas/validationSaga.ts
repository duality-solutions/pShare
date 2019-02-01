import { call, put, takeEvery } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import OnboardingActions from "../../shared/actions/onboarding";
import { validateDisplayname } from "../validation/validateDisplayname";
import { validateToken } from "../validation/validateToken";
import { validateUsername } from "../validation/validateUsername";
import { ValidationResult } from "../../shared/system/validator/ValidationResult";

export function* validationSaga() {
    yield takeEvery(getType(OnboardingActions.validateUsername), function* (action: ActionType<typeof OnboardingActions.validateUsername>) {
        const username = action.payload
        const validationResult: ValidationResult<string> = yield call(validateUsername, username)
        yield put(OnboardingActions.usernameValidated(validationResult));
    })
    yield takeEvery(getType(OnboardingActions.validateDisplayname), function* (action: ActionType<typeof OnboardingActions.validateDisplayname>) {
        const displayname = action.payload
        const validationResult: ValidationResult<string> = yield call(validateDisplayname, displayname)
        yield put(OnboardingActions.displaynameValidated(validationResult));
    })

    yield takeEvery(getType(OnboardingActions.validateToken), function* (action: ActionType<typeof OnboardingActions.validateToken>) {
        const token = action.payload
        const validationResult: ValidationResult<string> = yield call(validateToken, token)
        yield put(OnboardingActions.tokenValidated(validationResult))
    })
}