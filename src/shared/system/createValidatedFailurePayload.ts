import { ValidationResult } from "./validator/ValidationResult";
import { NamedValue } from "./validator/NamedValue";
export const createValidatedFailurePayload = <T>(fieldScope: string, fieldName: string, message: string, fieldValue: T, isError = false): NamedValue<ValidationResult<T>> => ({
    scope: fieldScope,
    name: fieldName,
    value: {
        success: false,
        validationMessages: [message],
        value: fieldValue,
        isError: isError
    }
})

