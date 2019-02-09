import { OnboardingActions } from "../../shared/actions/onboarding";
import { Validatable } from "../../shared/system/validator/Validatable";
import { getType } from "typesafe-actions";
import { validationScopes } from "./validationScopes";
import { ValidationState, FieldCollection } from "../../shared/system/validator/ValidationState";
import { reduceFieldValidatedAction, reduceResetValidationForFieldAction, reduceValidateFieldAction } from "./validationReducers";

interface PasswordCreateValidatedFields extends FieldCollection<Validatable<string>> {
    password: Validatable<string>
}
export type PasswordCreateValidationState = ValidationState<PasswordCreateValidatedFields>

const defaultState: PasswordCreateValidationState = {

    isValid: false,
    fields: { password: { isValidating: false, value: "" } }
}

export const passwordCreateFormValues = (state: PasswordCreateValidationState = defaultState, action: OnboardingActions) => {
    switch (action.type) {
        case getType(OnboardingActions.fieldValidated):
            return reduceFieldValidatedAction(action, validationScopes.password, state);
        case getType(OnboardingActions.validateField):
            return reduceValidateFieldAction(action, validationScopes.bdapAccount, state);
        case getType(OnboardingActions.resetValidationForField):
            return reduceResetValidationForFieldAction(action, validationScopes.password, state)


        default:
            return state;
    }
}

