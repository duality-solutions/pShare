import { put, takeEvery, call } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { Action } from "redux";
import OnboardingActions from "../../shared/actions/onboarding";
import { validate } from "../../shared/system/validator/validate";
import usernameValidationRules from "./usernameValidationRules";

export function* validationSaga() {
    yield takeEvery((action: Action<any>) => /^validate\/request\//.test(action.type), function* (action: OnboardingActions) {
        switch (action.type) {
            case getType(OnboardingActions.validateUsername):
                const username = action.payload
                const errors: string[] = yield call(validate(usernameValidationRules), username)

                yield put(OnboardingActions.usernameValidated({ success: errors.length == 0, value: username, errors }));
                break;
        }
    });
}

