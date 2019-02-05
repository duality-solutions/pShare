// import { ValidationResult } from './validation';
//import { createLocalStandardAction } from '../system/createLocalStandardAction';
interface ValueValidationPayload<T> extends NoValueValidationPayload {
    value: T;
}
interface NoValueValidationPayload {
    fieldName: string;
}
export type ValidationPayload<T> = T extends void ? NoValueValidationPayload : ValueValidationPayload<T>;
