import OnboardingActions from "../../shared/actions/onboarding";

interface PasswordState{
    password?:string
}

const passwordCreateFormValues = (state: PasswordState = {}, action: OnboardingActions) => state

export default passwordCreateFormValues