import { ActionType, createStandardAction } from 'typesafe-actions';


const OnboardingActions = {
    createAccount: createStandardAction('onboarding/CREATE_ACCOUNT')<void>(),
}

type OnboardingActions = ActionType<typeof OnboardingActions>;

// ensure this is added to ./index.ts RootActions
export default OnboardingActions