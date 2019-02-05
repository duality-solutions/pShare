import { put, take, takeEvery } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import OnboardingActions from "../../shared/actions/onboarding";
export function* onboardingSaga() {


    yield takeEvery(getType(OnboardingActions.submitUserName), function* (action: ReturnType<typeof OnboardingActions.submitUserName>) {
        yield* runForField("userName", action.payload, OnboardingActions.enterUserName())
    });
    yield takeEvery(getType(OnboardingActions.submitCommonName), function* (action: ReturnType<typeof OnboardingActions.submitCommonName>) {
        yield* runForField("commonName", action.payload, OnboardingActions.enterCommonName())
    });

    yield takeEvery(getType(OnboardingActions.submitToken), function* (action: ReturnType<typeof OnboardingActions.submitToken>) {
        yield* runForField("token", action.payload, OnboardingActions.enterToken())
    })
}

function* runForField<T>(fieldName: string, value: string, action: OnboardingActions) {
    yield put(OnboardingActions.validate({ fieldName, value }));
    const { payload: { value: validationResult } }: ReturnType<typeof OnboardingActions.validated> =
        yield take(
            (action: OnboardingActions) =>
                action.type === getType(OnboardingActions.validated)
                && action.payload.fieldName === fieldName);
    console.log("validation result is ", validationResult);

    if (validationResult.success) {
        yield put(action)
    }
}
