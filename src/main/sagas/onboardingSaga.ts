import { put, take, takeEvery } from "redux-saga/effects";
import { getType, ActionType } from "typesafe-actions";
import OnboardingActions from "../../shared/actions/onboarding";
export function* onboardingSaga() {
    yield takeEvery(getType(OnboardingActions.submitUserName), function* (action: ReturnType<typeof OnboardingActions.submitUserName>) {
        yield put(OnboardingActions.validateUserName(action.payload));
        const { payload: validationResult }: ActionType<typeof OnboardingActions.userNameValidated> = yield take(getType(OnboardingActions.userNameValidated));
        console.log("validation result is ", validationResult);
        if (validationResult.success) {
            yield put(OnboardingActions.enterUserName())
        }
    });
    yield takeEvery(getType(OnboardingActions.submitCommonName), function* (action: ReturnType<typeof OnboardingActions.submitCommonName>) {
        yield put(OnboardingActions.validateCommonName(action.payload));
        const { payload: validationResult }: ActionType<typeof OnboardingActions.commonNameValidated> = yield take(getType(OnboardingActions.commonNameValidated));
        console.log("validation result is ", validationResult);
        if (validationResult.success) {
            yield put(OnboardingActions.enterCommonName())
        }
    });

    yield takeEvery(getType(OnboardingActions.submitToken), function* (action: ReturnType<typeof OnboardingActions.submitToken>) {
        yield put(OnboardingActions.validateToken(action.payload))
        const { payload: validationResult }: ActionType<typeof OnboardingActions.tokenValidated> = yield take(getType(OnboardingActions.tokenValidated))
        console.log("validation result is ", validationResult)
        if(validationResult.success) {
            yield put(OnboardingActions.enterToken())
        }
    })
}
