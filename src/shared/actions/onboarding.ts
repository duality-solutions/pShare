import { ActionType, createStandardAction } from 'typesafe-actions';
import { ValidationResult } from '../system/validator/ValidationResult';
import { CreateBdapAccountConfig } from '../dynamicd/interfaces/CreateBdapAccountConfig';
const OnboardingActions = {
    validateUsername: createStandardAction('validate/request/USERNAME')<string>(),
    resetValidationResultUsername: createStandardAction('reset/validation/USERNAME')<void>(),
    validateDisplayname: createStandardAction('validate/request/DISPLAYNAME')<string>(),
    resetValidationResultDisplayname: createStandardAction('reset/validation/DISPLAYNAME')<void>(),
    validateToken: createStandardAction('validate/request/TOKEN')<string>(),
    resetValidationResultToken: createStandardAction('reset/validation/TOKEN')<void>(),
    usernameValidated: createStandardAction('validate/result/USERNAME')<ValidationResult<string>>(),
    displaynameValidated: createStandardAction('validate/result/DISPLAYNAME')<ValidationResult<string>>(),
    tokenValidated: createStandardAction('validate/result/TOKEN')<ValidationResult<string>>(),
    createAccount: createStandardAction('onboarding/CREATE_ACCOUNT')<void>(),
    submitUsername: createStandardAction('onboarding/USERNAME_SUBMIT')<string>(),
    submitDisplayname: createStandardAction('onboarding/DISPLAYNAME_SUBMIT')<string>(),
    submitToken: createStandardAction('onboarding/TOKEN_SUBMIT')<string>(),
    //usernameValidationFailed: createStandardAction('onboarding/USERNAME_VALIDATION_FAILED')<ValidationResult<string>>(),
    commitUsername: createStandardAction('onboarding/COMMIT_USERNAME')<string>(),
    commitDisplayname: createStandardAction('onboarding/COMMIT_DISPLAYNAME')<string>(),
    commitToken: createStandardAction('onboarding/COMMIT_TOKEN')<string>(),
    enterUsername: createStandardAction('onboarding/CREATE_USERNAME')<void>(),
    enterDisplayname: createStandardAction('onboarding/CREATE_DISPLAYNAME')<void>(),
    enterToken: createStandardAction('onboarding/CREATE_TOKEN')<void>(),
    createBdapAccount: createStandardAction('onboarding/CREATE_BDAP_ACCOUNT')<CreateBdapAccountConfig>(),
    bdapAccountCreated: createStandardAction('onboarding/BDAP_ACCOUNT_CREATED')<GetUserInfo>(),
    resetOnboarding: createStandardAction("onboarding/RESET_ONBOARDING")<void>()
}

type OnboardingActions = ActionType<typeof OnboardingActions>;

// ensure this is added to ./index.ts RootActions
export default OnboardingActions
