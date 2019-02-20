import { put, takeEvery } from "redux-saga/effects";
import { ActionType, getType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { createValidatedFailurePayload } from "../../shared/system/validator/createValidatedFailurePayload";
import { validationScopes } from "../../renderer/reducers/validationScopes";

export function* translateMnemonicFileSaveFailedActionsToValidationMessages() {
    yield takeEvery(
        getType(OnboardingActions.mnemonicFileSaveFailed),
        function* (action: ActionType<typeof OnboardingActions.mnemonicFileSaveFailed>) {
            const failureMessage = action.payload;
            const payload = createValidatedFailurePayload(validationScopes.mnemonicFilePassword, "mnemonicFilePassword", failureMessage, undefined as any as string, true);
            yield put(OnboardingActions.fieldValidated(payload));
        });
}
