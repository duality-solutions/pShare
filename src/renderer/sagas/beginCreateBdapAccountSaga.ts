import { put, select, takeEvery } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { RendererRootState } from "../reducers";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { OnboardingBdapAccountOptionsValidationState } from "../reducers/bdapAccountFormValues";


export function* beginCreateBdapAccountSaga() {
    yield takeEvery(getType(OnboardingActions.beginCreateBdapAccount), function* (_) {
        const onboardingValidationState: OnboardingBdapAccountOptionsValidationState = yield select((state: RendererRootState) => state.bdapAccountFormValues)
        if (!onboardingValidationState.isValid) {
            throw Error("unexpected value, state.onboarding.isValid is false")
        }
        const {
            userName: {
                value: userName
            },
            commonName: {
                value: commonName
            },
            token: {
                value: token
            },
        } = onboardingValidationState.fields
        yield put(OnboardingActions.tokenCaptured())
        yield put(OnboardingActions.createBdapAccount({ commonName, userName, token }))

    })
    const predicate = (action: OnboardingActions) =>
        action.type === getType(OnboardingActions.bdapAccountCreated)
        || action.type === getType(OnboardingActions.createBdapAccountFailed)
    yield takeEvery(predicate, function* (action: OnboardingActions) {
        const success = (() => {
            switch (action.type) {
                case getType(OnboardingActions.bdapAccountCreated):
                    return true
                default:
                    return false
            }
        })();

        if (typeof success !== 'undefined') {
            yield put(OnboardingActions.createBdapAccountComplete())

        } else {
            yield put(OnboardingActions.resetOnboarding())
        }
    })

}