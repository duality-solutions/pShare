import { OnboardingActions } from '../actions/onboarding';
import { getType } from 'typesafe-actions';
export interface MnemonicFileRestoreState {
    error?: string;
}
const defaultState: MnemonicFileRestoreState = {};
export const mnemonicFileRestore = (state: MnemonicFileRestoreState = defaultState, action: OnboardingActions): MnemonicFileRestoreState => {
    switch (action.type) {
        case getType(OnboardingActions.mnemonicRestoreFileDecryptFailed):
            return { ...state, error: "Decryption failed" };
        case getType(OnboardingActions.restoreFailed):
            return { ...state, error: `Restore failed: ${action.payload}` };
        case getType(OnboardingActions.secureFilePasswordCancelled):
        case getType(OnboardingActions.mnemonicRestoreFilePassphraseSubmitted):
            const { error, ...rest } = state;
            return rest;
        default:
            return state;
    }
};
