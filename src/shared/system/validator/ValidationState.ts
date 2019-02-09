import { Validatable } from "./Validatable";

export interface ValidationState<TFields extends FieldCollection<Validatable<string>> {
    fields: TFields;
    isValid: boolean;
}

export interface FieldCollection<T> {
    [propName: string]: T
}