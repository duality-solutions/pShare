import { ActionType, createStandardAction } from 'typesafe-actions';

const handleUsername = createStandardAction('onboarding/HANDLE_USERNAME').map( (username:string | undefined) => ({
    payload: username,
    meta: { scope: 'local' }
}))

const handleDisplayname = createStandardAction('onboarding/HANDLE_DISPLAYNAME').map((displayname: string|undefined) => ({
    payload: displayname,
    meta: { scope: 'local' }
}))

const OnboardingActions = {
    createAccount: createStandardAction('onboarding/CREATE_ACCOUNT')<void>(),
    enterUsername: createStandardAction('onboarding/ENTER_USERNAME')<void>(),
    enterDisplayname: createStandardAction('onboarding/ENTER_DISPLAYNAME')<void>(),
    enterToken: createStandardAction('onboarding/ENTER_TOKEN')<void>(),
    createPassword: createStandardAction('onboarding/ENTER_PASSWORD')<void>(),
    handleUsername, handleDisplayname

}

type OnboardingActions = ActionType<typeof OnboardingActions>;

// ensure this is added to ./index.ts RootActions
export default OnboardingActions
