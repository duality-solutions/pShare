import { getType } from 'typesafe-actions';
import { OnboardingActions } from '../../shared/actions/onboarding';
import { Validatable } from '../../shared/system/validator/Validatable';
import { validationScopes } from './validationScopes';
import { ValidationState } from '../../shared/system/validator/ValidationState';
import { FieldCollection } from "../../shared/system/validator/FieldCollection";
import { reduceFieldValidatedAction, reduceResetValidationForFieldAction, reduceValidateFieldAction } from './validationReducers'

interface OnboardingBdapAccountOptionsValidatedFields extends FieldCollection<Validatable<string>> {
    userName: Validatable<string>,
    commonName: Validatable<string>,
    token: Validatable<string>
}

export type OnboardingBdapAccountOptionsValidationState = ValidationState<OnboardingBdapAccountOptionsValidatedFields>

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

export const bdapAccountFormValues = (state: OnboardingBdapAccountOptionsValidationState = defaultState, action: OnboardingActions): OnboardingBdapAccountOptionsValidationState => {
    switch (action.type) {
        case getType(OnboardingActions.createBdapAccountFailed): {
            const message = action.payload
            return {
                ...state,
                fields: {
                    ...state.fields,
                    userName: {
                        ...state.fields.userName,
                        validationResult: {
                            isError: false,
                            success: false,
                            validationMessages: ["BDAP account creation failed", message],
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
            return reduceFieldValidatedAction(action, validationScopes.bdapAccount, state);
        }

        case getType(OnboardingActions.validateField):
            return reduceValidateFieldAction(action, validationScopes.bdapAccount, state);

        case getType(OnboardingActions.resetValidationForField):
            return reduceResetValidationForFieldAction(action, validationScopes.bdapAccount, state);
        default:
            return state;


    }
}




