import { ActionType, createStandardAction } from 'typesafe-actions';

export const DashboardActions = {

    viewSharedFiles: createStandardAction('dashboard/myLinks/VIEW_SHARED_FILES')<string>(),
    toggleSpinner: createStandardAction('dashboard/TOGGLE_SPINNER')<void>(),

}

export type DashboardActions = ActionType<typeof DashboardActions>;
