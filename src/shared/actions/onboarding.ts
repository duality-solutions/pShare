import { ActionType, createStandardAction } from 'typesafe-actions';


const OnboardingActions = {
    createAccount: createStandardAction('onboarding/CREATE_ACCOUNT')<void>(),
    enterUsername: createStandardAction('onboarding/CREATE_USERNAME')<void>(),
    enterDisplayname: createStandardAction('onboarding/CREATE_DISPLAYNAME')<void>(),
    createPassword: createStandardAction('onboarding/CREATE_PASSWORD')<void>()
}

type OnboardingActions = ActionType<typeof OnboardingActions>;

// ensure this is added to ./index.ts RootActions
export default OnboardingActions