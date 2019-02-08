import { ValidationResult } from "./validator/ValidationResult";
import { NamedValue } from "./validator/NamedValue";
export function createValidatedFailurePayload<T>(fieldName: string, message: string, fieldValue: T): NamedValue<ValidationResult<T>> {
    return {
        name: fieldName,
        value: {
            success: false,
            validationMessages: [message],
            value: fieldValue,
            isError: false
        }
    };
}
