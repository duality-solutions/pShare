import { Action } from "redux";
import { call, put, takeEvery } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import OnboardingActions from "../../shared/actions/onboarding";
import { validateDisplayname } from "../validation/validateDisplayname";
import { validateToken } from "../validation/validateToken";
import { validateUsername } from "../validation/validateUsername";

export function* validationSaga() {
    yield takeEvery((action: Action<any>) => /^validate\/request\//.test(action.type), function* (action: OnboardingActions) {
        switch (action.type) {
            case getType(OnboardingActions.validateUsername): {
                const username = action.payload
                const errors: string[] = yield call(validateUsername, username)

                yield put(OnboardingActions.usernameValidated({ success: errors.length == 0, value: username, errors }));
                break;
            }
            case getType(OnboardingActions.validateDisplayname): {
                const displayname = action.payload
                const errors: string[] = yield call(validateDisplayname, displayname)
                yield put(OnboardingActions.displaynameValidated({ success: errors.length == 0, value: displayname, errors }));
                break;
            }
            case getType(OnboardingActions.validateToken): {
                const token = action.payload
                const errors: string[] = yield call(validateToken, token)
                yield put(OnboardingActions.tokenValidated({ success: errors.length == 0 , value: token, errors }))
            }
        }
    });
}

