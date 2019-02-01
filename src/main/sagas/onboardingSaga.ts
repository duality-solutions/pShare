import { put, take, takeEvery } from "redux-saga/effects";
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
    yield takeEvery(getType(OnboardingActions.submitDisplayname), function* (action: ReturnType<typeof OnboardingActions.submitDisplayname>) {
        yield put(OnboardingActions.validateDisplayname(action.payload));
        //I'm sure there's a better way to get this type than using returntype
        const { payload: validationResult }: ReturnType<typeof OnboardingActions.displaynameValidated> = yield take(getType(OnboardingActions.displaynameValidated));
        console.log("validation result is ", validationResult);
        if (validationResult.success) {
            yield put(OnboardingActions.enterDisplayname())
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
