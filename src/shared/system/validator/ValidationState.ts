import { Validatable } from "./Validatable";
import { FieldCollection } from "./FieldCollection";

export interface ValidationState<TFields extends FieldCollection<Validatable<string>>> {
    fields: TFields;
    isValid: boolean;
}

