import { UserActions } from '../actions/user'
import { getType } from 'typesafe-actions';
import { OnboardingActions } from '../actions/onboarding';
import { deleteOptionalProperty } from '../system/deleteOptionalProperty';
import { deleteOptionalProperties } from "../system/deleteOptionalProperties";
import { AppActions } from '../actions/app';

export interface UserState {
    accountCreated: boolean
    accountCreationTxId?: string
    syncAgreed: boolean
    isOnboarded: boolean
    userName?: string
    walletEncrypted: boolean
    sessionWalletPassword?: string //this should not be persisted. EVER
    sessionWalletMnemonic?: string //nor this
}
const defaultState: UserState = { syncAgreed: false, isOnboarded: false, walletEncrypted: false, accountCreated: false }

export const user = (state: UserState = defaultState, action: UserActions | OnboardingActions | AppActions): UserState => {
    switch (action.type) {
        case getType(UserActions.userAgreeSync):
            return { ...state, syncAgreed: true }
        case getType(OnboardingActions.restoreSuccess):
            return { ...state, userName: action.payload, accountCreated: true }
        case getType(OnboardingActions.createBdapAccount):
            const { userName } = action.payload
            return { ...state, userName }
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
        case (getType(OnboardingActions.createBdapAccountTxIdReceived)):
            return { ...state, accountCreationTxId: action.payload }
        case (getType(OnboardingActions.bdapAccountCreated)):
            return deleteOptionalProperty({ ...state, accountCreated: true, userName: action.payload }, "accountCreationTxId")
        case (getType(OnboardingActions.createBdapAccountFailed)):
            return deleteOptionalProperty({ ...state, accountCreated: false }, "accountCreationTxId")
        default:
            return state;

    }
}


