import { ActionType, createStandardAction } from 'typesafe-actions';


const CounterActions = {
    increment: createStandardAction('@@counter/INCREMENT')<void>(),
    decrement: createStandardAction('@@counter/DECREMENT')<void>(),
    incrementIfOdd: createStandardAction('@@counter/INCREMENT_IF_ODD')<void>()
}

type CounterActions = ActionType<typeof CounterActions>;

export default CounterActions