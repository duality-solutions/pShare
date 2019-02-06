import { put, select, takeEvery } from "redux-saga/effects";
import { getType } from "typesafe-actions";
import { RendererRootState } from "../reducers";
import OnboardingActions from "../../shared/actions/onboarding";
import { OnboardingBdapAccountOptionsValidationState } from "../reducers/onboarding";


export function* beginCreateBdapAccountSaga() {
    yield takeEvery(getType(OnboardingActions.beginCreateBdapAccount), function* (_) {
        const onboardingValidationState: OnboardingBdapAccountOptionsValidationState = yield select((state: RendererRootState) => state.onboarding)
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
        yield put(OnboardingActions.createBdapAccount({ commonName, userName, token }))
    })

}