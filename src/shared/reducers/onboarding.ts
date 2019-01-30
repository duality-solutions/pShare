import { getType } from 'typesafe-actions';
import OnboardingActions from '../actions/onboarding';

interface OnboardingState {
    username: string | undefined
}

export default (state: OnboardingState = { username: '' }, action: OnboardingActions): OnboardingState => {
    switch (action.type) {
        case getType(OnboardingActions.handleUsername):
            return { ...state, username: action.payload }
        default:
            return state;
    }
} 