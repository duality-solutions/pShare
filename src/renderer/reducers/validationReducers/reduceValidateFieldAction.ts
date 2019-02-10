import { ActionType } from 'typesafe-actions';
import { OnboardingActions } from '../../../shared/actions/onboarding';
import { ValidationState } from '../../../shared/system/validator/ValidationState';
import { FieldCollection } from "../../../shared/system/validator/FieldCollection";
import { FieldNameInfo } from '../../../shared/system/validator/FieldNameInfo';
import { Validatable } from '../../../shared/system/validator/Validatable';
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
