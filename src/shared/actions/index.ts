import { ActionType } from 'typesafe-actions';
import AppActions from './app';
import OnboardingActions from './onboarding';
import StoreActions from './store';
import SyncActions from './sync';
import UserActions from './user';

const RootActions = { ...StoreActions, ...AppActions, ...UserActions, ...SyncActions, ...OnboardingActions }

type RootActions = ActionType<typeof RootActions>

export default RootActions