export interface ValidationResult<T> {
    value: T;
    success: boolean;
    errors: string[];
}
