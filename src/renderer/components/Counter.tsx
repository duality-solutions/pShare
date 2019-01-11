import * as React from 'react'

export interface CounterStateProps {
  counter: number
}
export interface CounterDispatchProps {

  decrement: () => void
  increment: () => void
  incrementIfOdd: () => void
  navgigateHome: () => void

}
type CounterProps = CounterStateProps & CounterDispatchProps

export const Counter: React.FunctionComponent<CounterProps> = ({ counter, decrement, increment, incrementIfOdd, navgigateHome }) =>
  <>
    <div>
      <h1>Counter</h1>
      <h3>Count: <span id="counter-count">{counter}</span></h3>
    </div>
    <div>
      <h4>normal reducer</h4>
      <button id="increment-button" onClick={_ => increment()}>Increment</button>
      <button onClick={_ => decrement()}>Decrement</button>
    </div>
    <div>
      <h4>via epic</h4>
      <button onClick={_ => incrementIfOdd()} id="increment-if-odd-button">Increment by 2 if Odd (with 1 sec delay)</button>
    </div>
    <div>
      <h4>routing</h4>
      <button onClick={navgigateHome}>home</button>
    </div >
  </>