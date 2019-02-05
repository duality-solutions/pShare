import { getType } from 'typesafe-actions';
import OnboardingActions from '../../shared/actions/onboarding';
import { ValidationResult } from "../../shared/system/validator/ValidationResult";
import { blinq } from 'blinq';
import { keys } from '../../shared/system/entries';
import { FieldNameInfo } from '../system/FieldNameInfo';

interface Validatable<T> {
    value: T,
    validationResult?: ValidationResult<T>,
    isValidating: boolean
}

interface OnboardingBdapAccountOptionsValidatedFields {
    userName: Validatable<string>,
    commonName: Validatable<string>,
    token: Validatable<string>
}
interface OnboardingBdapAccountOptionsValidationState {
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
        case getType(OnboardingActions.validated): {
            const { value: validationResult, fieldName } = action.payload;
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

        case getType(OnboardingActions.validate):
            {
                const { fieldName } = <FieldNameInfo<OnboardingBdapAccountOptionsValidatedFields>>action.payload;
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

        case getType(OnboardingActions.resetValidation):
            {
                const { fieldName } = <FieldNameInfo<OnboardingBdapAccountOptionsValidatedFields>>action.payload;
                const requiresReset = typeof state.fields[fieldName].validationResult !== 'undefined' || state.isValid;
                return requiresReset
                    ? {
                        ...state,
                        fields: typeof state.fields[fieldName].validationResult !== 'undefined'
                            ? {
                                ...state.fields,
                                [fieldName]: {
                                    ...(state.fields)[fieldName],
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