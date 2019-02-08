import { put, take, takeEvery } from "redux-saga/effects";
import { ActionType, getType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
export function* onboardingSaga() {


    yield takeEvery(getType(OnboardingActions.submitUserName), function* (action: ActionType<typeof OnboardingActions.submitUserName>) {
        yield* runForField("userName", action.payload, OnboardingActions.userNameCaptured())
    });
    yield takeEvery(getType(OnboardingActions.submitCommonName), function* (action: ActionType<typeof OnboardingActions.submitCommonName>) {
        yield* runForField("commonName", action.payload, OnboardingActions.commonNameCaptured())
    });

    yield takeEvery(getType(OnboardingActions.submitToken), function* (action: ActionType<typeof OnboardingActions.submitToken>) {
        yield* runForField("token", action.payload, OnboardingActions.beginCreateBdapAccount())
    })

    // yield takeEvery(getType(OnboardingActions.submitPassword), function* (action: ActionType<typeof OnboardingActions.submitPassword>){
    //     yield put(OnboardingActions.passwordCaptured())
    // })
}

function* runForField<T>(fieldName: string, value: string, action: OnboardingActions) {
    yield put(OnboardingActions.validateField({ name: fieldName, value }));
    const { payload: { value: validationResult } }: ActionType<typeof OnboardingActions.fieldValidated> =
        yield take(
            (action: OnboardingActions) =>
                action.type === getType(OnboardingActions.fieldValidated)
                && action.payload.name === fieldName);
    console.log("validation result is ", validationResult);

    if (validationResult.success) {
        yield put(action)
    }
}
