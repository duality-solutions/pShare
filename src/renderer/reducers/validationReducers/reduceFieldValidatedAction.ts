import { blinq } from 'blinq';
import { ActionType } from 'typesafe-actions';
import { OnboardingActions } from '../../../shared/actions/onboarding';
import { keys } from '../../../shared/system/entries';
import { ValidationState } from '../../../shared/system/validator/ValidationState';
import { FieldCollection } from "../../../shared/system/validator/FieldCollection";
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
