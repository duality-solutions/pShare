import { OnboardingActions } from '../actions/onboarding';
import { getType } from 'typesafe-actions';

// export { default as onboarding } from './onboarding';
export { sync } from './sync';
export { user } from './user';
export { bdap } from './bdap';
export { sharedFiles } from './sharedFiles'
export { fileWatch } from './fileWatch'

interface MnemonicFileRestoreState {
    error?: string
}
const defaultState: MnemonicFileRestoreState = {}
export const mnemonicFileRestore = (state: MnemonicFileRestoreState = defaultState, action: OnboardingActions): MnemonicFileRestoreState => {
    switch (action.type) {
        case getType(OnboardingActions.mnemonicRestoreFileDecryptFailed):
            return { ...state, error: "Decryption failed" }
        default:
            return state
    }
}