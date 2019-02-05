import { ActionType, createStandardAction } from 'typesafe-actions';
import { ValidationResult } from '../system/validator/ValidationResult';
// import { ValidationResult } from './validation';
//import { createLocalStandardAction } from '../system/createLocalStandardAction';

const OnboardingActions = {
    validateUserName: createStandardAction('validate/request/USERNAME')<string>(),
    validateCommonName: createStandardAction('validate/request/COMMONNAME')<string>(),
    validateToken : createStandardAction('validate/request/TOKEN')<string>(),
    userNameValidated: createStandardAction('validate/result/USERNAME')<ValidationResult<string>>(),
    commonNameValidated: createStandardAction('validate/result/COMMONNAME')<ValidationResult<string>>(),
    tokenValidated: createStandardAction('validate/result/TOKEN')<ValidationResult<string>>(),
    resetValidationResultUserName: createStandardAction('reset/validation/USERNAME')<void>(),
    resetValidationResultCommonName: createStandardAction('reset/validation/COMMONNAME')<void>(),
    resetValidationResultToken: createStandardAction('reset/validation/TOKEN')<void>(),
    createAccount: createStandardAction('onboarding/CREATE_ACCOUNT')<void>(),
    submitUserName: createStandardAction('onboarding/USERNAME_SUBMIT')<string>(),
    submitCommonName: createStandardAction('onboarding/COMMONNAME_SUBMIT')<string>(),
    submitToken: createStandardAction('onboarding/TOKEN_SUBMIT')<string>(),
    commitUserName: createStandardAction('onboarding/COMMIT_USERNAME')<string>(),
    commitCommonName: createStandardAction('onboarding/COMMIT_COMMONNAME')<string>(),
    commitToken: createStandardAction('onboarding/COMMIT_TOKEN')<string>(),
    enterUserName: createStandardAction('onboarding/CREATE_USERNAME')<void>(),
    enterCommonName: createStandardAction('onboarding/CREATE_COMMONNAME')<void>(),
    enterToken: createStandardAction('onboarding/CREATE_TOKEN')<void>(),
    backToCreateAccount: createStandardAction('go_back_to/CREATE_TOKEN')<void>(),
}

type OnboardingActions = ActionType<typeof OnboardingActions>;

// ensure this is added to ./index.ts RootActions
export default OnboardingActions
