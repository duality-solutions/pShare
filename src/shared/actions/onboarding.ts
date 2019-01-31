import { ActionType, createStandardAction } from 'typesafe-actions';
import { ValidationResult } from '../system/validator/ValidationResult';
// import { ValidationResult } from './validation';
//import { createLocalStandardAction } from '../system/createLocalStandardAction';





const OnboardingActions = {
    validateUsername: createStandardAction('validate/request/USERNAME')<string>(),
    validateDisplayname: createStandardAction('validate/request/DISPLAYNAME')<string>(),
    usernameValidated: createStandardAction('validate/result/USERNAME')<ValidationResult<string>>(),
    displaynameValidated: createStandardAction('validate/result/DISPLAYNAME')<ValidationResult<string>>(),
    createAccount: createStandardAction('onboarding/CREATE_ACCOUNT')<void>(),
    submitUsername: createStandardAction('onboarding/USERNAME_SUBMIT')<string>(),
    submitDisplayname: createStandardAction('onboarding/DISPLAYNAME_SUBMIT')<string>(),
    //usernameValidationFailed: createStandardAction('onboarding/USERNAME_VALIDATION_FAILED')<ValidationResult<string>>(),
    commitUsername: createStandardAction('onboarding/COMMIT_USERNAME')<string>(),
    commitDisplayname: createStandardAction('onboarding/COMMIT_DISPLAYNAME')<string>(),
    enterUsername: createStandardAction('onboarding/CREATE_USERNAME')<void>(),
    enterDisplayname: createStandardAction('onboarding/CREATE_DISPLAYNAME')<void>(),
    createPassword: createStandardAction('onboarding/CREATE_PASSWORD')<void>()
}

type OnboardingActions = ActionType<typeof OnboardingActions>;

// ensure this is added to ./index.ts RootActions
export default OnboardingActions