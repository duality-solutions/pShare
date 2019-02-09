import { ValidationResult } from "./validator/ValidationResult";
import { NamedValue } from "./validator/NamedValue";
export const createValidatedSuccessPayload = <T>(fieldScope: string, fieldName: string, fieldValue: T): NamedValue<ValidationResult<T>> => ({
    scope: fieldScope,
    name: fieldName,
    value: {
        success: true,
        validationMessages: [],
        value: fieldValue,
        isError: false
    }
});
