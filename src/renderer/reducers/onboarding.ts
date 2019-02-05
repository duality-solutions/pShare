import { getType } from 'typesafe-actions';
import OnboardingActions from '../../shared/actions/onboarding';
import { ValidationResult } from "../../shared/system/validator/ValidationResult";

interface Validatable<T> {
    value: T,
    validationResult?: ValidationResult<T>,
    isValidating: boolean
}

interface OnboardingUserNameCommonnameValidationState {
    userName: Validatable<string>,
    commonName: Validatable<string>,
    token: Validatable<string>,
    isValid: boolean
}

const defaultState: OnboardingUserNameCommonnameValidationState = {
    userName: {
        value: "",
        isValidating: false

    },
    commonName: {
        value: "",
        isValidating: false

    },
    token: {
        value: "",
        isValidating: false

    },
    isValid: false
}

export default (state: OnboardingUserNameCommonnameValidationState = defaultState, action: OnboardingActions): OnboardingUserNameCommonnameValidationState => {
    switch (action.type) {
        case getType(OnboardingActions.userNameValidated): {
            const validationResult = action.payload;
            return {
                ...state,
                userName: {
                    value: action.payload.value,
                    validationResult,
                    isValidating: false
                },
                isValid: action.payload.success && state.commonName.validationResult ? state.commonName.validationResult.success : false
            }
        }
        case getType(OnboardingActions.commonNameValidated): {
            const validationResult = action.payload;
            return {
                ...state,
                commonName: {
                    value: action.payload.value,
                    validationResult,
                    isValidating: false
                },
                isValid: action.payload.success && state.userName.validationResult ? state.userName.validationResult.success : false
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
        case getType(OnboardingActions.validateUserName):
            return {
                ...state,
                userName: {
                    ...state.userName,
                    isValidating: true
                }
            }
        case getType(OnboardingActions.validateCommonName):
            return {
                ...state,
                commonName: {
                    ...state.commonName,
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
        case getType(OnboardingActions.resetValidationResultUserName):
            return {
                ...state,
                userName: {
                    ...state.userName,
                    isValidating: false,
                    validationResult: undefined
                }
            }
        case getType(OnboardingActions.resetValidationResultCommonName):
            return {
                ...state,
                commonName: {
                    ...state.commonName,
                    isValidating: false,
                    validationResult: undefined
                }
            }
        case getType(OnboardingActions.resetValidationResultToken):
            return {
                ...state,
                token: {
                    ...state.token,
                    isValidating: false,
                    validationResult: undefined
                }
            }
        default:
            return state;


    }
}