import { call, put, takeEvery } from "redux-saga/effects";
import { ActionType, getType } from "typesafe-actions";
import { PayloadCreator } from "typesafe-actions/dist/types";
import OnboardingActions from "../../shared/actions/onboarding";
import { ValidationResult } from "../../shared/system/validator/ValidationResult";
import { validateCommonName } from "../validation/validateCommonName";
import { validateToken } from "../validation/validateToken";
import { validateUserName } from "../validation/validateUserName";

export function* validationSaga() {
    yield takeEveryValidationAction(OnboardingActions.validateUserName, validateUserName, OnboardingActions.userNameValidated)
    yield takeEveryValidationAction(OnboardingActions.validateCommonName, validateCommonName, OnboardingActions.commonNameValidated)
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
