export interface ValidationResult<T> {
    value: T;
    success: boolean;
    validationMessages: string[];
    isError: boolean
}
