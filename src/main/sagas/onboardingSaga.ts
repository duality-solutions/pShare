import { put, takeEvery, take } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import OnboardingActions from "../../shared/actions/onboarding";
export function* onboardingSaga() {
    yield takeEvery(getType(OnboardingActions.submitUsername), function* (action: ReturnType<typeof OnboardingActions.submitUsername>) {
        yield put(OnboardingActions.validateUsername(action.payload));
        //I'm sure there's a better way to get this type than using returntype
        const { payload: validationResult }: ReturnType<typeof OnboardingActions.usernameValidated> = yield take(getType(OnboardingActions.usernameValidated));
        console.log("validation result is ", validationResult);
        if (validationResult.success) {
            yield put(OnboardingActions.enterUsername())
        }
    });
}
