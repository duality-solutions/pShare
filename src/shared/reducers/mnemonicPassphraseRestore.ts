import { OnboardingActions } from '../actions/onboarding';
import { getType } from 'typesafe-actions';
import { MnemonicFileRestoreState } from "./mnemonicFileRestore";
interface MnemonicPassphraseRestoreState {
    error?: string;
}
const mpDefaultState: MnemonicPassphraseRestoreState = {};
export const mnemonicPassphraseRestore = (state: MnemonicFileRestoreState = mpDefaultState, action: OnboardingActions): MnemonicPassphraseRestoreState => {
    switch (action.type) {
        case getType(OnboardingActions.restoreFailed):
            return { ...state, error: `Restore failed: ${action.payload}` };
            case getType(OnboardingActions.restoreWithMnemonicFileCancelled):
            case getType(OnboardingActions.restoreWithPassphraseCancelled):
            case getType(OnboardingActions.mnemonicSubmittedForRestore):
            const { error, ...rest } = state;
            return rest;
        default:
            return state;
    }
};
