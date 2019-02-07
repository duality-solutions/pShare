import { call, put, takeEvery } from "redux-saga/effects";
import { ActionType, getType } from "typesafe-actions";
import OnboardingActions from "../../shared/actions/onboarding";
import { ValidationResult } from "../../shared/system/validator/ValidationResult";
import { validateCommonName } from "../validation/validateCommonName";
import { validateToken } from "../validation/validateToken";
import { validateUserName } from "../validation/validateUserName";

export function* validationSaga() {
    yield takeEveryValidationAction("userName", validateUserName)
    yield takeEveryValidationAction("commonName", validateCommonName)
    yield takeEveryValidationAction("token", validateToken)
}

function takeEveryValidationAction(
    fieldName: string,
    validationFunc: (value: string) => Promise<ValidationResult<string>>
) {
    const predicate = (action: OnboardingActions) => action.type === getType(OnboardingActions.validateField)
        && action.payload.fieldName === fieldName;
    return takeEvery(predicate, function* (action: ActionType<typeof OnboardingActions.validateField>) {
        const valueToValidate = action.payload.value;
        const validationResult: ValidationResult<string> = yield call(() => validationFunc(valueToValidate));
        const act = OnboardingActions.fieldValidated({ fieldName, value: validationResult });
        yield put(act);
    });
}
