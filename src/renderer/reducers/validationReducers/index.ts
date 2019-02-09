import { blinq } from 'blinq';
import { ActionType } from 'typesafe-actions';
import { OnboardingActions } from '../../../shared/actions/onboarding';
import { keys } from '../../../shared/system/entries';
import { ValidationState, FieldCollection } from '../../../shared/system/validator/ValidationState';
import { FieldNameInfo } from '../../../shared/system/validator/FieldNameInfo';
import { Validatable } from '../../../shared/system/validator/Validatable';
export function reduceFieldValidatedAction<TFields extends FieldCollection<Validatable<string>>>(action: ActionType<typeof OnboardingActions.fieldValidated>, requiredFieldScope: string, state: ValidationState<TFields>) {
    const { value: validationResult, name: fieldName, scope: fieldScope } = action.payload;
    return fieldScope !== requiredFieldScope
        ? state
        : {
            ...state,
            fields: {
                ...state.fields,
                [fieldName]: {
                    value: validationResult.value,
                    validationResult,
                    isValidating: false
                }
            },
            isValid: validationResult.success
                && blinq(keys(state.fields))
                    .where(f => fieldName !== f)
                    .all(f => {
                        const vr = state.fields[f].validationResult;
                        return typeof vr !== 'undefined' && vr.success;
                    })
        };
}
export function reduceResetValidationForFieldAction<T extends FieldCollection<Validatable<string>>>(action: ActionType<typeof OnboardingActions.resetValidationForField>, requiredScope: string, state: ValidationState<T>) {
    const { name, scope } = <FieldNameInfo<T>>action.payload;
    const requiresReset = (typeof state.fields[name] !== 'undefined' && typeof state.fields[name].validationResult !== 'undefined') || state.isValid;
    return scope !== requiredScope
        ? state
        : requiresReset
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
            : state;
}

export function reduceValidateFieldAction<T extends FieldCollection<Validatable<string>>>(action: ActionType<typeof OnboardingActions.validateField>, requiredScope: string, state: ValidationState<T>) {
    const { name: fieldName, scope } = <FieldNameInfo<T>>action.payload;
    return scope !== requiredScope
        ? state
        : {
            ...state,
            fields: {
                ...state.fields,
                [fieldName]: {
                    ...state.fields[fieldName],
                    isValidating: true
                }
            }
        };
}