// import { ValidationResult } from './validation';
//import { createLocalStandardAction } from '../system/createLocalStandardAction';
interface FieldValidationMessageWithValue<T> extends EmptyFieldValidationMessage {
    value: T;
}
interface EmptyFieldValidationMessage {
    fieldName: string;
}
export type FieldValidationMessage<T> = T extends void ? EmptyFieldValidationMessage : FieldValidationMessageWithValue<T>;
