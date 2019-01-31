import { getType } from 'typesafe-actions';
import { ValidationResult } from "../../shared/system/ValidationResult";
import OnboardingActions from '../../shared/actions/onboarding';

interface Validatable<T> {
    value: T,
    validationResult?: ValidationResult<T>,
    isValidating: boolean
}

interface OnboardingUsernameCommonnameValidationState {
    username: Validatable<string>,
    commonname: Validatable<string>,
    isValid: boolean
}

const defaultState: OnboardingUsernameCommonnameValidationState = {
    username: {
        value: "df",
        isValidating: false

    },
    commonname: {
        value: "",
        isValidating: false

    },
    isValid: false
}

export default (state: OnboardingUsernameCommonnameValidationState = defaultState, action: OnboardingActions): OnboardingUsernameCommonnameValidationState => {
    switch (action.type) {
        case getType(OnboardingActions.usernameValidated):
            const validationResult = action.payload;
            return {
                ...state,
                username: {
                    value: action.payload.value,
                    validationResult,
                    isValidating: false
                },
                isValid: action.payload.success && state.commonname.validationResult ? state.commonname.validationResult.success : false
            }
        case getType(OnboardingActions.validateUsername):
            return {
                ...state,
                username: {
                    ...state.username,
                    isValidating: true
                }
            }
        default:
            return state;


    }
}