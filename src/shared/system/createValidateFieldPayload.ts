import { NameIndicatorWithValue } from "./validator/NamedValue";
export const createValidateFieldPayload = <T>(scope: string, name: string, value: T): NameIndicatorWithValue<T> => ({ name, scope, value });
