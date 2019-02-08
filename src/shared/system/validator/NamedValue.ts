// import { ValidationResult } from './validation';
//import { createLocalStandardAction } from '../system/createLocalStandardAction';
interface NameIndicatorWithValue<T> extends NameIndictator {
    value: T;
}
interface NameIndictator {
    name: string;
}
export type NamedValue<T> = T extends void ? NameIndictator : NameIndicatorWithValue<T>;
