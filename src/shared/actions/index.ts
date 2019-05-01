import { ActionType } from 'typesafe-actions';
import { AppActions } from './app';
import { OnboardingActions } from './onboarding';
import { StoreActions } from './store';
import { SyncActions } from './sync';
import { UserActions } from './user';
import { RtcActions } from './rtc';
import { DashboardActions } from './dashboard';
import { SharedFilesActions } from './sharedFiles';
import { FileWatchActions } from './fileWatch';
import { AddFileActions } from './addFile';
import { BdapActions } from './bdap';
import { FileListActions } from './fileList';

export const RootActions = {
    ...StoreActions,
    ...AppActions,
    ...UserActions,
    ...SyncActions,
    ...OnboardingActions,
    ...DashboardActions,
    ...SharedFilesActions,
    ...FileWatchActions,
    ...AddFileActions,
    ...BdapActions,
    ...FileListActions,
    ...RtcActions
}

export type RootActions = ActionType<typeof RootActions>

