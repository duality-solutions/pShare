import { AnyAction } from "redux";

export type MapPropsToDispatchObj<T> = { [P in keyof T]: (...args:any[]) => AnyAction }
