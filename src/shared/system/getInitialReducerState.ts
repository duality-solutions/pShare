import { Reducer } from "redux";

const getInitialReducerState = <S>(reducer: Reducer<S>) => reducer(undefined, { type: null })
export default getInitialReducerState
