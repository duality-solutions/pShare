import { ActionType } from 'typesafe-actions';
import { AppActions } from './app';
import { OnboardingActions } from './onboarding';
import { StoreActions } from './store';
import { SyncActions } from './sync';
import { UserActions } from './user';
import { DashboardActions } from './dashboard';

export const RootActions = { ...StoreActions, ...AppActions, ...UserActions, ...SyncActions, ...OnboardingActions, ...DashboardActions }

export type RootActions = ActionType<typeof RootActions>

