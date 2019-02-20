import { ActionType } from 'typesafe-actions';
import { OnboardingActions } from '../../../shared/actions/onboarding';
import { ValidationState } from '../../../shared/system/validator/ValidationState';
import { FieldCollection } from "../../../shared/system/validator/FieldCollection";
import { FieldNameInfo } from '../../../shared/system/validator/FieldNameInfo';
import { Validatable } from '../../../shared/system/validator/Validatable';
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
