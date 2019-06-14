import { getType } from "typesafe-actions";
import { OnboardingActions } from "../../shared/actions/onboarding";
import { FieldCollection } from "../../shared/system/validator/FieldCollection";
import { Validatable } from "../../shared/system/validator/Validatable";
import { ValidationState } from "../../shared/system/validator/ValidationState";
import { reduceFieldValidatedAction, reduceResetValidationForFieldAction, reduceValidateFieldAction } from './validationReducers';
import { validationScopes } from "./validationScopes";


interface PasswordCreateValidatedFields extends FieldCollection<Validatable<string>> {
    mnemonicFilePassword: Validatable<string>
}
export type PasswordCreateValidationState = ValidationState<PasswordCreateValidatedFields>

const defaultState: PasswordCreateValidationState = {
    isValid: false,
    fields: { mnemonicFilePassword: { isValidating: false, value: "" } }
}

export const secureMnemonicFileFormValues = (state: PasswordCreateValidationState = defaultState, action: OnboardingActions) => {
    switch (action.type) {
        case getType(OnboardingActions.fieldValidated):
            return reduceFieldValidatedAction(action, validationScopes.mnemonicFilePassword, state);
        case getType(OnboardingActions.validateField):
            return reduceValidateFieldAction(action, validationScopes.mnemonicFilePassword, state);
        case getType(OnboardingActions.resetValidationForField):
            return reduceResetValidationForFieldAction(action, validationScopes.mnemonicFilePassword, state)


        default:
            return state;
    }
}