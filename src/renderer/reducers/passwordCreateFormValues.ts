import OnboardingActions from "../../shared/actions/onboarding";
import { Validatable } from "../../shared/system/validator/Validatable";
import { getType } from "typesafe-actions";
import { blinq } from "blinq";
import { keys } from "../../shared/system/entries";
import { FieldNameInfo } from "../../shared/system/validator/FieldNameInfo";

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
        case getType(OnboardingActions.resetValidationForField): {
            const { name } = <FieldNameInfo<PasswordCreateValidatedFields>>action.payload;
            const requiresReset = typeof state.fields[name] != 'undefined' && typeof state.fields[name].validationResult !== 'undefined' || state.isValid;
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

export default passwordCreateFormValues