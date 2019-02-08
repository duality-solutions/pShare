import { UserActions } from '../actions/user'
import { getType } from 'typesafe-actions';
import { OnboardingActions } from '../actions/onboarding';

interface UserState {
    syncAgreed: boolean
    isOnboarded: boolean
    userName?: string
}

export const user = (state: UserState = { syncAgreed: false, isOnboarded: false }, action: UserActions | OnboardingActions): UserState => {
    switch (action.type) {
        case getType(UserActions.userAgreeSync):
            return { ...state, syncAgreed: true }
        case getType(OnboardingActions.bdapAccountCreated):
            return { ...state, userName: action.payload }
        default:
            return state;

    }
} 