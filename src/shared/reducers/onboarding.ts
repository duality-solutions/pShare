import { getType } from 'typesafe-actions';
import OnboardingActions from '../actions/onboarding';

interface OnboardingState {
    username: string | undefined,
    displayname: string | undefined,
}

export default (state: OnboardingState = { username: '', displayname: '' }, action: OnboardingActions): OnboardingState => {
    switch (action.type) {
        case getType(OnboardingActions.handleUsername):
            return { ...state, username: action.payload }
            case getType(OnboardingActions.handleDisplayname):
            return { ...state, displayname: action.payload }
        default:
            return state;
    }
}