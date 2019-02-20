// https://stackoverflow.com/a/49579497/14357
import { RequiredKeys } from "./RequiredKeys";
export type ExcludeOptionalProps<T> = Pick<T, RequiredKeys<T>>;
