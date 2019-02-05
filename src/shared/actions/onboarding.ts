import { ActionType, createStandardAction } from 'typesafe-actions';
import { ValidationResult } from '../system/validator/ValidationResult';
import { ValidationPayload } from '../system/validator/ValueValidationPayload';
const OnboardingActions = {

    validate: createStandardAction('validate/request')<ValidationPayload<string>>(),

    validated: createStandardAction('validate/result')<ValidationPayload<ValidationResult<string>>>(),

    resetValidation: createStandardAction('reset/validation')<ValidationPayload<void>>(),

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
