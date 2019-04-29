import { ActionType, createStandardAction } from 'typesafe-actions';

export const DashboardActions = {

    viewSharedFiles: createStandardAction('dashboard/myLinks/VIEW_SHARED_FILES')<string>(),
    viewMyLinks: createStandardAction('dashboard/myLinks/VIEW_MY_LINKS')<void>(),
    toggleSpinner: createStandardAction('dashboard/TOGGLE_SPINNER')<void>(),

}

export type DashboardActions = ActionType<typeof DashboardActions>;
