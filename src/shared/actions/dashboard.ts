import { ActionType, createStandardAction } from 'typesafe-actions';
import { GetUserInfo } from '../../dynamicdInterfaces/GetUserInfo';

export const DashboardActions = {

    startViewSharedFiles: createStandardAction('dashboard/myLinks/START_VIEW_SHARED_FILES')<string>(),
    viewSharedFiles: createStandardAction('dashboard/myLinks/VIEW_SHARED_FILES')<GetUserInfo>(),
    viewMyLinks: createStandardAction('dashboard/myLinks/VIEW_MY_LINKS')<void>(),
    toggleSpinner: createStandardAction('dashboard/TOGGLE_SPINNER')<void>(),

}

export type DashboardActions = ActionType<typeof DashboardActions>;
