import { ValidationResult } from "./validator/ValidationResult";
import { NamedValue } from "./validator/NamedValue";
export function createValidatedFailurePayload<T>(fieldScope: string, fieldName: string, message: string, fieldValue: T): NamedValue<ValidationResult<T>> {
    return {
        scope: fieldScope,
        name: fieldName,
        value: {
            success: false,
            validationMessages: [message],
            value: fieldValue,
            isError: false
        }
    };
}
