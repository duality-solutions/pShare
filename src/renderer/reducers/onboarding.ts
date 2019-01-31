import { getType } from 'typesafe-actions';
import OnboardingActions from '../../shared/actions/onboarding';
import { ValidationResult } from "../../shared/system/validator/ValidationResult";

interface Validatable<T> {
    value: T,
    validationResult?: ValidationResult<T>,
    isValidating: boolean
}

interface OnboardingUsernameCommonnameValidationState {
    username: Validatable<string>,
    displayname: Validatable<string>,
    token: Validatable<string>,
    isValid: boolean
}

const defaultState: OnboardingUsernameCommonnameValidationState = {
    username: {
        value: "",
        isValidating: false

    },
    displayname: {
        value: "",
        isValidating: false

    },
    token: {
        value: "",
        isValidating: false

    },
    isValid: false
}

export default (state: OnboardingUsernameCommonnameValidationState = defaultState, action: OnboardingActions): OnboardingUsernameCommonnameValidationState => {
    switch (action.type) {
        case getType(OnboardingActions.usernameValidated): {
            const validationResult = action.payload;
            return {
                ...state,
                username: {
                    value: action.payload.value,
                    validationResult,
                    isValidating: false
                },
                isValid: action.payload.success && state.displayname.validationResult ? state.displayname.validationResult.success : false
            }
        }
        case getType(OnboardingActions.displaynameValidated): {
            const validationResult = action.payload;
            return {
                ...state,
                displayname: {
                    value: action.payload.value,
                    validationResult,
                    isValidating: false
                },
                isValid: action.payload.success && state.username.validationResult ? state.username.validationResult.success : false
            }
        }
        case getType(OnboardingActions.tokenValidated): {
            const validationResult = action.payload
            return {
                ...state,
                token: {
                    value: action.payload.value,
                    validationResult,
                    isValidating: false
                },
                // isValid: action.payload.success 
            }
        }
        case getType(OnboardingActions.validateUsername):
            return {
                ...state,
                username: {
                    ...state.username,
                    isValidating: true
                }
            }
        case getType(OnboardingActions.validateDisplayname):
            return {
                ...state,
                displayname: {
                    ...state.displayname,
                    isValidating: true
                }
            }
        case getType(OnboardingActions.validateToken):
            return {
                ...state,
                token: {
                    ...state.token,
                    isValidating: true
                }
            }
        default:
            return state;


    }
}