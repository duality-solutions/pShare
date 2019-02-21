import { UserActions } from '../actions/user'
import { getType } from 'typesafe-actions';
import { OnboardingActions } from '../actions/onboarding';
import { deleteOptionalProperty, deleteOptionalProperties } from '../system/deleteOptionalProperty';
import { AppActions } from '../actions/app';

interface UserState {
    syncAgreed: boolean
    isOnboarded: boolean
    userName?: string
    walletEncrypted: boolean
    sessionWalletPassword?: string //this should not be persisted. EVER
    sessionWalletMnemonic?: string //nor this
}
const defaultState: UserState = { syncAgreed: false, isOnboarded: false, walletEncrypted: false }

export const user = (state: UserState = defaultState, action: UserActions | OnboardingActions | AppActions): UserState => {
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
        case (getType(OnboardingActions.mnemonicAcquired)):
            return { ...state, sessionWalletMnemonic: action.payload }
        case (getType(OnboardingActions.mnemonicSecured)):
            return deleteOptionalProperty(state, "sessionWalletMnemonic")
        case (getType(AppActions.initializeApp)):
            return deleteOptionalProperties(state, "sessionWalletMnemonic", "sessionWalletPassword")
        default:
            return state;

    }
}


