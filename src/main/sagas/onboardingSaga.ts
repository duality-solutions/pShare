import { put, take, takeEvery } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import OnboardingActions from "../../shared/actions/onboarding";
export function* onboardingSaga() {
    yield takeEvery(getType(OnboardingActions.submitUserName), function* (action: ReturnType<typeof OnboardingActions.submitUserName>) {
        yield put(OnboardingActions.validateUserName(action.payload));
        //I'm sure there's a better way to get this type than using returntype
        const { payload: validationResult }: ReturnType<typeof OnboardingActions.userNameValidated> = yield take(getType(OnboardingActions.userNameValidated));
        console.log("validation result is ", validationResult);
        if (validationResult.success) {
            yield put(OnboardingActions.enterUserName())
        }
    });
    yield takeEvery(getType(OnboardingActions.submitCommonName), function* (action: ReturnType<typeof OnboardingActions.submitCommonName>) {
        yield put(OnboardingActions.validateCommonName(action.payload));
        //I'm sure there's a better way to get this type than using returntype
        const { payload: validationResult }: ReturnType<typeof OnboardingActions.commonNameValidated> = yield take(getType(OnboardingActions.commonNameValidated));
        console.log("validation result is ", validationResult);
        if (validationResult.success) {
            yield put(OnboardingActions.enterCommonName())
        }
    });

    yield takeEvery(getType(OnboardingActions.submitToken), function* (action: ReturnType<typeof OnboardingActions.submitToken>) {
        yield put(OnboardingActions.validateToken(action.payload))
        //I'm sure there's a better way to get this type than using returntype
        const { payload: validationResult }: ReturnType<typeof OnboardingActions.tokenValidated> = yield take(getType(OnboardingActions.tokenValidated))
        console.log("validation result is ", validationResult)
        if(validationResult.success) {
            yield put(OnboardingActions.enterToken())
        }
    })
}
