import { UserActions } from '../actions/user'
import { getType } from 'typesafe-actions';
import { OnboardingActions } from '../actions/onboarding';

interface UserState {
    syncAgreed: boolean
    isOnboarded: boolean
    userName?: string
    walletEncrypted: boolean
    sessionWalletPassword?: string //this should not be persisted. EVER
}

export const user = (state: UserState = { syncAgreed: false, isOnboarded: false, walletEncrypted: false }, action: UserActions | OnboardingActions): UserState => {
    switch (action.type) {
        case getType(UserActions.userAgreeSync):
            return { ...state, syncAgreed: true }
        case getType(OnboardingActions.bdapAccountCreated):
            return { ...state, userName: action.payload }
        case getType(OnboardingActions.walletPasswordSetSuccess):
            return { ...state, walletEncrypted: true }
        case getType(OnboardingActions.walletIsEncrypted):
            return { ...state, walletEncrypted: action.payload }
        case (getType(OnboardingActions.setSessionWalletPassword)):
            return { ...state, sessionWalletPassword: action.payload }
        default:
            return state;

    }
} 