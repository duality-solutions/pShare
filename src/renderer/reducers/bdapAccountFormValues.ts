import { blinq } from 'blinq';
import { getType } from 'typesafe-actions';
import OnboardingActions from '../../shared/actions/onboarding';
import { keys } from '../../shared/system/entries';
import { FieldNameInfo } from '../../shared/system/validator/FieldNameInfo';
import { Validatable } from '../../shared/system/validator/Validatable';

interface OnboardingBdapAccountOptionsValidatedFields {
    userName: Validatable<string>,
    commonName: Validatable<string>,
    token: Validatable<string>
}
export interface OnboardingBdapAccountOptionsValidationState {
    fields: OnboardingBdapAccountOptionsValidatedFields,
    isValid: boolean
}

const defaultState: OnboardingBdapAccountOptionsValidationState = {
    fields: {
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

        }
    },
    isValid: false
}

export default (state: OnboardingBdapAccountOptionsValidationState = defaultState, action: OnboardingActions): OnboardingBdapAccountOptionsValidationState => {
    switch (action.type) {
        case getType(OnboardingActions.resetOnboarding): {
            return {
                ...state,
                fields: {
                    ...state.fields,
                    userName: {
                        ...state.fields.userName,
                        validationResult: {
                            isError: false,
                            success: false,
                            validationMessages: ["BDAP account creation failed", "Try a different user name"],
                            value: state.fields.userName.value
                        },
                        isValidating: false
                    }
                },
                isValid: false
            }
            break;
        }
        case getType(OnboardingActions.fieldValidated): {
            const { value: validationResult, name: fieldName } = action.payload;
            return {
                ...state,
                fields: {
                    ...state.fields,
                    [fieldName]: {
                        value: validationResult.value,
                        validationResult,
                        isValidating: false
                    }
                },
                isValid:
                    validationResult.success
                    && blinq(keys(state.fields))
                        .where(f => fieldName !== f)
                        .all(f => {
                            const vr = state.fields[f].validationResult;
                            return typeof vr !== 'undefined' && vr.success;
                        })
            }
        }

        case getType(OnboardingActions.validateField):
            {
                const { name: fieldName } = <FieldNameInfo<OnboardingBdapAccountOptionsValidatedFields>>action.payload;
                return {
                    ...state,
                    fields: {
                        ...state.fields,
                        [fieldName]: {
                            ...state.fields[fieldName],
                            isValidating: true
                        }
                    }
                }
            }

        case getType(OnboardingActions.resetValidationForField):
            {
                const { name } = <FieldNameInfo<OnboardingBdapAccountOptionsValidatedFields>>action.payload;
                const requiresReset = typeof state.fields[name].validationResult !== 'undefined' || state.isValid;
                return requiresReset
                    ? {
                        ...state,
                        fields: typeof state.fields[name].validationResult !== 'undefined'
                            ? {
                                ...state.fields,
                                [name]: {
                                    ...(state.fields)[name],
                                    isValidating: false,
                                    validationResult: undefined
                                }
                            }
                            : state.fields,
                        isValid: false
                    }
                    : state
            }

        default:
            return state;


    }
}