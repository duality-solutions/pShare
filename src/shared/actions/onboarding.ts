import { ActionType, createStandardAction } from 'typesafe-actions';

const handleUsername = createStandardAction('onboarding/HANDLE_USERNAME').map( (username:string | undefined) => ({
    payload: username,
    meta: { scope: 'local' }
}))

const OnboardingActions = {
    createAccount: createStandardAction('onboarding/CREATE_ACCOUNT')<void>(),
    enterUsername: createStandardAction('onboarding/CREATE_USERNAME')<void>(),
    enterDisplayname: createStandardAction('onboarding/CREATE_DISPLAYNAME')<void>(),
    enterPhonenumber: createStandardAction('onboarding/CREATE_PHONENUMBER')<void>(),
    createPassword: createStandardAction('onboarding/CREATE_PASSWORD')<void>(),
    handleUsername,

}

type OnboardingActions = ActionType<typeof OnboardingActions>;

// ensure this is added to ./index.ts RootActions
export default OnboardingActions
