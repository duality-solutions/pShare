import { OptionalKeys } from "./generic-types/OptionalKeys";
import { deleteOptionalProperty } from "./deleteOptionalProperty";
export const deleteOptionalProperties = <T>(obj: T, ...ids: OptionalKeys<T>[]): T => ids.reduce((prev, id) => deleteOptionalProperty(prev, id), obj);
