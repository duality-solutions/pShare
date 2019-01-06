import CounterActions from '../actions/counter'
import { getType } from 'typesafe-actions';

export default (state: number = 0, action: CounterActions) => {
    switch (action.type) {
        case getType(CounterActions.decrement):
            return state - 1;
        case getType(CounterActions.increment):
            return state + 1;
        default:
            return state;

    }
} 