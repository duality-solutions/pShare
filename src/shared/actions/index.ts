import StoreActions from './store'
import { ActionType } from 'typesafe-actions';
import AppActions from './app';
import UserActions from './user';
import SyncActions from './sync'


const RootActions = { ...StoreActions, ...AppActions, ...UserActions, ...SyncActions }

type RootActions = ActionType<typeof RootActions>

export default RootActions