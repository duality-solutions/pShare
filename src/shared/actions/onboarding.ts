import { ActionType, createStandardAction } from 'typesafe-actions';
import { CreateBdapAccountConfig } from '../dynamicd/interfaces/CreateBdapAccountConfig';
import { createLocalStandardAction } from '../system/createLocalStandardAction';
import { ValidationResult } from '../system/validator/ValidationResult';
import { FieldValidationMessage } from '../system/validator/FieldValidationMessage';
const OnboardingActions = {

    validateField: createStandardAction('validate/request')<FieldValidationMessage<string>>(),

    fieldValidated: createStandardAction('validate/result')<FieldValidationMessage<ValidationResult<string>>>(),

    resetValidationForField: createLocalStandardAction('reset/validation')<FieldValidationMessage<void>>(),

    createAccount: createStandardAction('onboarding/CREATE_ACCOUNT')<void>(),
    submitUserName: createStandardAction('onboarding/USERNAME_SUBMIT')<string>(),
    submitCommonName: createStandardAction('onboarding/COMMONNAME_SUBMIT')<string>(),
    submitToken: createStandardAction('onboarding/TOKEN_SUBMIT')<string>(),
    submitPassword: createStandardAction('onboarding/PASSWORD_SUBMIT')<string>(),
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
    bdapAccountCreated: createStandardAction('onboarding/BDAP_ACCOUNT_CREATED')<GetUserInfo>(),
    createBdapAccountFailed: createStandardAction('onboarding/CREATE_BDAP_ACCOUNT_FAILED')<void>(),
    resetOnboarding: createStandardAction("onboarding/RESET_ONBOARDING")<void>()
}

type OnboardingActions = ActionType<typeof OnboardingActions>;

// ensure this is added to ./index.ts RootActions
export default OnboardingActions
