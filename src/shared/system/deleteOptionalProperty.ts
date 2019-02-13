import { OptionalKeys } from "./generic-types/OptionalKeys";

/** Typesafe way to delete optional properties from an object using magic of OptionalKeys<T> */
export const deleteOptionalProperty = <T>(obj: T, id: OptionalKeys<T>): T => {
    const { [id]: deleted, ...newState } = obj;
    return newState as T // this type-conversion is safe because we're sure we only deleted optional props
}