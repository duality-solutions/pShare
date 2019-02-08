import { ValidationResult } from "./ValidationResult";
export interface Validatable<T> {
    value: T;
    validationResult?: ValidationResult<T>;
    isValidating: boolean;
}
