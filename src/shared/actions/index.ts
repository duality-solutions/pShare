import { ActionType } from 'typesafe-actions';
import { AppActions } from './app';
import { OnboardingActions } from './onboarding';
import { StoreActions } from './store';
import { SyncActions } from './sync';
import { UserActions } from './user';
import { DashboardActions } from './dashboard';
import { SharedFilesActions } from './sharedFiles';

export const RootActions = {
    ...StoreActions,
    ...AppActions,
    ...UserActions,
    ...SyncActions,
    ...OnboardingActions,
    ...DashboardActions,
    ...SharedFilesActions
}

export type RootActions = ActionType<typeof RootActions>

