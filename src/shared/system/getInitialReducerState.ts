import { Reducer } from "redux";

export const getInitialReducerState = <S>(reducer: Reducer<S>) => reducer(undefined, { type: null })
