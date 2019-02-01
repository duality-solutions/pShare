import { call, put, takeEvery } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import OnboardingActions from "../../shared/actions/onboarding";
import { validateDisplayname } from "../validation/validateDisplayname";
import { validateToken } from "../validation/validateToken";
import { validateUsername } from "../validation/validateUsername";

export function* validationSaga() {
    yield takeEvery(getType(OnboardingActions.validateUsername), function* (action: ActionType<typeof OnboardingActions.validateUsername>) {
        const username = action.payload
        const errors: string[] = yield call(validateUsername, username)
        yield put(OnboardingActions.usernameValidated({ success: errors.length == 0, value: username, errors }));
    })
    yield takeEvery(getType(OnboardingActions.validateDisplayname), function* (action: ActionType<typeof OnboardingActions.validateDisplayname>) {
        const displayname = action.payload
        const errors: string[] = yield call(validateDisplayname, displayname)
        yield put(OnboardingActions.displaynameValidated({ success: errors.length == 0, value: displayname, errors }));
    })

    yield takeEvery(getType(OnboardingActions.validateToken), function* (action: ActionType<typeof OnboardingActions.validateToken>) {
        const token = action.payload
        const errors: string[] = yield call(validateToken, token)
        yield put(OnboardingActions.tokenValidated({ success: errors.length == 0, value: token, errors }))
    })
}