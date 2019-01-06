import CounterActions from './counter'
import StoreActions from './store'
import { ActionType } from 'typesafe-actions';


const RootActions = { ...CounterActions, ...StoreActions }

type RootActions = ActionType<typeof RootActions>

export default RootActions