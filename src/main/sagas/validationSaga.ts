import { call, put, takeEvery } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import OnboardingActions from "../../shared/actions/onboarding";
import { validateDisplayname } from "../validation/validateDisplayname";
import { validateToken } from "../validation/validateToken";
import { validateUsername } from "../validation/validateUsername";
import { ValidationResult } from "../../shared/system/validator/ValidationResult";
import { PayloadCreator } from "typesafe-actions/dist/types";

export function* validationSaga() {
    yield takeEveryValidationAction(OnboardingActions.validateUsername, validateUsername, OnboardingActions.usernameValidated)
    yield takeEveryValidationAction(OnboardingActions.validateDisplayname, validateDisplayname, OnboardingActions.displaynameValidated)
    yield takeEveryValidationAction(OnboardingActions.validateToken, validateToken, OnboardingActions.tokenValidated)
}

function takeEveryValidationAction<TAction extends string, TValidatedValue>(
    validateAction: PayloadCreator<TAction, TValidatedValue>,
    validationFunc: (value: TValidatedValue) => Promise<ValidationResult<TValidatedValue>>,
    validatedAction: PayloadCreator<TAction, ValidationResult<TValidatedValue>>
) {
    return takeEvery(getType(validateAction), function* (action: ActionType<typeof validateAction>) {
        const valueToValidate = action.payload;
        const validationResult: ValidationResult<TValidatedValue> = yield call(validationFunc, valueToValidate);
        yield put(validatedAction(validationResult));
    });
}
