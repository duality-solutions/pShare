import { ValidationResult } from "./validator/ValidationResult";
import { NamedValue } from "./validator/NamedValue";
export function createValidatedFailurePayload<T>(fieldScope: string, fieldName: string, message: string, fieldValue: T, isError = false): NamedValue<ValidationResult<T>> {
    return {
        scope: fieldScope,
        name: fieldName,
        value: {
            success: false,
            validationMessages: [message],
            value: fieldValue,
            isError: isError
        }
    };
}
export function createValidatedSuccessPayload<T>(fieldScope: string, fieldName: string, fieldValue: T): NamedValue<ValidationResult<T>> {
    return {
        scope: fieldScope,
        name: fieldName,
        value: {
            success: true,
            validationMessages: [],
            value: fieldValue,
            isError: false
        }
    };
}
