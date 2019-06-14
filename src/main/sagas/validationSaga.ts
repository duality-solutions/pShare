import { call, put, takeEvery } from "redux-saga/effects";
import { ActionType, getType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { ValidationResult } from "../../shared/system/validator/ValidationResult";
import { validateCommonName } from "../validation/validateCommonName";
import { validateToken } from "../validation/validateToken";
import { validateUserName } from "../validation/validateUserName";
import { validationScopes } from "../../renderer/reducers/validationScopes";
import { RpcClient } from "../RpcClient";

export function* validationSaga(rpcClient: RpcClient) {
    yield takeEveryValidationAction(validationScopes.bdapAccount, "userName", v => validateUserName(rpcClient, v))
    yield takeEveryValidationAction(validationScopes.bdapAccount, "commonName", v => validateCommonName(rpcClient, v))
    yield takeEveryValidationAction(validationScopes.bdapAccount, "token", v => validateToken(rpcClient, v))
}

function takeEveryValidationAction(
    fieldScope: string,
    fieldName: string,
    validationFunc: (value: string) => Promise<ValidationResult<string>>
) {
    const predicate = (action: OnboardingActions) => action.type === getType(OnboardingActions.validateField)
        && action.payload.name === fieldName;
    return takeEvery(predicate, function* (action: ActionType<typeof OnboardingActions.validateField>) {
        const valueToValidate = action.payload.value;
        const validationResult: ValidationResult<string> = yield call(() => validationFunc(valueToValidate));
        const act = OnboardingActions.fieldValidated({ scope: fieldScope, name: fieldName, value: validationResult });
        yield put(act);
    });
}
