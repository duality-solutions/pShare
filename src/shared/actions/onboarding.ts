import { ActionType, createStandardAction } from 'typesafe-actions';
import { CreateBdapAccountConfig } from '../dynamicd/interfaces/CreateBdapAccountConfig';
import { createLocalStandardAction } from '../system/createLocalStandardAction';
import { NamedValue } from '../system/validator/NamedValue';
import { ValidationResult } from '../system/validator/ValidationResult';

// interface OperationResult {
//     success: boolean
// }

// ensure this is added to ./index.ts RootActions
export const OnboardingActions = {

    validateField: createStandardAction('validate/request')<NamedValue<string>>(),

    fieldValidated: createStandardAction('validate/result')<NamedValue<ValidationResult<string>>>(),

    resetValidationForField: createLocalStandardAction('reset/validation')<NamedValue<void>>(),

    createAccount: createStandardAction('onboarding/CREATE_ACCOUNT')<void>(),
    submitUserName: createStandardAction('onboarding/USERNAME_SUBMIT')<string>(),
    submitCommonName: createStandardAction('onboarding/COMMONNAME_SUBMIT')<string>(),
    submitToken: createStandardAction('onboarding/TOKEN_SUBMIT')<string>(),
    submitPassword: createStandardAction('onboarding/SET_WALLET_PASSWORD')<string>(),
    commitUserName: createStandardAction('onboarding/COMMIT_USERNAME')<string>(),
    commitCommonName: createStandardAction('onboarding/COMMIT_COMMONNAME')<string>(),
    commitToken: createStandardAction('onboarding/COMMIT_TOKEN')<string>(),

    userNameCaptured: createStandardAction('onboarding/USER_NAME_CAPTURED')<void>(),
    commonNameCaptured: createStandardAction('onboarding/COMMON_NAME_CAPTURED')<void>(),
    tokenCaptured: createStandardAction('onboarding/TOKEN_CAPTURED')<void>(),
    createBdapAccountComplete: createStandardAction('onboarding/CREATE_BDAP_ACCOUNT_COMPLETE')<void>(),

    passwordCaptured: createStandardAction('onboarding/PASSWORD_CAPTURED')<void>(),

    backToCreateAccount: createStandardAction('go_back_to/CREATE_TOKEN')<void>(),
    beginCreateBdapAccount: createStandardAction('onboarding/BEGIN_CREATE_BDAP_ACCOUNT')<void>(),
    createBdapAccount: createStandardAction('onboarding/CREATE_BDAP_ACCOUNT')<CreateBdapAccountConfig>(),
    bdapAccountCreated: createStandardAction('onboarding/BDAP_ACCOUNT_CREATED')<string>(),
    createBdapAccountFailed: createStandardAction('onboarding/CREATE_BDAP_ACCOUNT_FAILED')<string>(),
    resetOnboarding: createStandardAction("onboarding/RESET_ONBOARDING")<void>(),

    setSessionWalletPassword: createStandardAction('onboarding/SET_WALLET_SESSION_PASSWORD')<string>(),
    walletPasswordSetSuccess: createStandardAction('onboarding/WALLET_PASSWORD_SET_SUCCESS')<void>(),
    walletPasswordSetFailed: createStandardAction('onboarding/WALLET_PASSWORD_SET_FAILED')<void>(),
    walletIsEncrypted: createStandardAction('onboarding/WALLET_IS_ENCRYPTED')<boolean>(),

    mnemonicWarningAccepted: createStandardAction('onboarding/MNEMONIC_WARNING_ACCEPTED')<void>(),
    mnemonicAcquired: createStandardAction('onboarding/MNEMONIC_RECEIVED')<string>(),
    mnemonicSecured: createStandardAction('onboarding/MNEMONIC_SECURED')<void>(),
    mnemonicFileCreation: createStandardAction('onboarding/MNEMONIC_FILE_CREATION')<void>(),

    mnemonicFilePasswordSubmit: createStandardAction("onboarding/MNEMONIC_FILE_PASSWORD_SUBMIT")<string>(),
    mnemonicFilePasswordCancelled: createStandardAction("onboarding/MNEMONIC_FILE_PASSWORD_CANCELLED")<void>(),

    // encryptAndSaveMnemonicWithPassword: createStandardAction('onboarding/ENCRYPT_SAVE_MNEMONIC_WITH_PASSWORD')<string>(),
    mnemonicFileSaveSuccess: createStandardAction('onboarding/ENCRYPT_SAVE_MNEMONIC_SUCCESS')<void>(),
    mnemonicFileSaveFailed: createStandardAction('onboarding/ENCRYPT_SAVE_MNEMONIC_FAIL')<string>(),
    mnemonicFileSavePathSelected: createStandardAction('onboarding/MNEMONIC_FILE_SAVE_PATH_SELECTED')<string>(),

    restoreAccount: createStandardAction('onboarding/RESTORE_ACCOUNT')<void>(),
    restoreWithPassphrase: createStandardAction('onboarding/RESTORE_WITH_PASSPHRASE')<void>(),
    restoreWithMnemonicFile: createStandardAction('onboarding/RESTORE_WITH_MNEMONIC_FILE')<void>(),
    restoreSync: createStandardAction('onboarding/RESTORE_SYNC')<void>(),
    secureFilePassword: createStandardAction('onboarding/RESTORE_SECURE_FILE_PASSWORD')<void>(),

    mnemonicSubmittedForRestore: createStandardAction("onboarding/MNEMONIC_SUBMITTED_FOR_RESTORE")<string>(),

    restoreWithPassphraseCancelled: createStandardAction('onboarding/RESTORE_WITH_PASSPHRASE_CANCELLED')<void>(),
    restoreWithMnemonicFileCancelled: createStandardAction('onboarding/RESTORE_WITH_MNEMONIC_FILE_CANCELLED')<void>(),
    secureFilePasswordCancelled: createStandardAction('onboarding/RESTORE_SECURE_FILE_PASSWORD_CANCELLED')<void>(),
    restoreCancelled: createStandardAction('onboarding/RESTORE_CANCELLED')<void>(),

    restoreFailed: createStandardAction("onboarding/RESTORE_FAILED")<string>(),
    restoreSuccess: createStandardAction("onboarding/RESTORE_SUCCESS")<string>(),
    restoring: createStandardAction("onboarding/RESTORING")<void>(),

    mnemonicFilePathSelected:createStandardAction("onboarding/MNEMONIC_FILE_PATH_SELECTED")<string>(),


    accountCreationCancelled: createStandardAction('onboarding/ACCOUNT_CREATION_CANCELLED')<void>(),
    commonNameCancelled: createStandardAction('onboarding/COMMON_NAME_CANCELLED')<void>(),
    tokenCancelled: createStandardAction('onboarding/TOKEN_CANCELLED')<void>(),
}

export type OnboardingActions = ActionType<typeof OnboardingActions>;

