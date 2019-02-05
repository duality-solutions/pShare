import { call, put, takeEvery } from "redux-saga/effects";
import { ActionType, getType } from "typesafe-actions";
//import { PayloadCreator } from "typesafe-actions/dist/types";
import OnboardingActions from "../../shared/actions/onboarding";
import { ValidationResult } from "../../shared/system/validator/ValidationResult";
import { validateCommonName } from "../validation/validateCommonName";
import { validateToken } from "../validation/validateToken";
import { validateUserName } from "../validation/validateUserName";
//import { Predicate } from "redux-saga";

export function* validationSaga() {
    yield takeEveryValidationAction<string>("userName", validateUserName)
    yield takeEveryValidationAction<string>("commonName", validateCommonName)
    yield takeEveryValidationAction<string>("token", validateToken)
}

function takeEveryValidationAction<TValidatedValue>(
    fieldName: string,
    validationFunc: (value: TValidatedValue) => Promise<ValidationResult<TValidatedValue>>
) {
    const predicate = (action: OnboardingActions) => action.type === getType(OnboardingActions.validate)
        && action.payload.fieldName === fieldName;
    return takeEvery(predicate, function* (action: ActionType<typeof OnboardingActions.validate>) {
        const valueToValidate = action.payload.value as any;
        const validationResult: ValidationResult<TValidatedValue> = yield call(() => validationFunc(valueToValidate));
        const act = OnboardingActions.validated({ fieldName, value: validationResult as any });
        yield put(act);
    });
}
