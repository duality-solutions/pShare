import OnboardingActions from "../../shared/actions/onboarding";
import { Validatable } from "../../shared/system/validator/Validatable";
import { getType } from "typesafe-actions";
import { blinq } from "blinq";
import { keys } from "../../shared/system/entries";

interface PasswordCreateValidatedFields {
    password: Validatable<string>
}
export interface PasswordCreateValidationState {
    fields: PasswordCreateValidatedFields,
    isValid: boolean
}

const defaultState: PasswordCreateValidationState = {

    isValid: false,
    fields: { password: { isValidating: false, value: "" } }
}

const passwordCreateFormValues = (state: PasswordCreateValidationState = defaultState, action: OnboardingActions) => {
    switch (action.type) {
        case getType(OnboardingActions.fieldValidated):
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
        default:
            return state;
    }
}

export default passwordCreateFormValues