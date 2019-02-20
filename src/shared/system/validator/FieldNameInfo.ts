//values of `name` can only be properties of T
//used for converting "untyped" names in NamedValue
//into typed names.
export interface FieldNameInfo<T> {
    name: keyof T;
    scope: string;
}
