import { ActionsObservable, StateObservable, combineEpics } from 'redux-observable'
import { filter, flatMap, withLatestFrom, tap } from 'rxjs/operators'

import CounterActions from '../../shared/actions/counter'
import { MainRootState } from '../reducers'
import { isActionOf } from 'typesafe-actions';
import RootActions from '../../shared/actions';

const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time))

const incrementIfOddEpic = (
    // provide all our Actions type that can flow through the stream
    // everything else is gonna be handled by TypeScript so we don't have to provide any explicit type annotations. Behold... top notch DX 👌❤️🦖
    action$: ActionsObservable<RootActions>,
    state$: StateObservable<MainRootState>
) =>
    action$.pipe(
        filter(isActionOf(CounterActions.incrementIfOdd)),
        withLatestFrom(state$),
        filter(([_, state]) => state.counter % 2 === 1),
        flatMap(async x => {
            await delay(1000);
            return x;
        }),
        flatMap(() => [CounterActions.increment(), CounterActions.increment()]),
        tap(x => console.log("epic : ", x))
    )

export const getRootEpic = () => combineEpics(incrementIfOddEpic)
