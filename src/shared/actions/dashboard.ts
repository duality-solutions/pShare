import { ActionType, createStandardAction } from 'typesafe-actions';

export const DashboardActions = {

    viewSharedFiles: createStandardAction('dashboard/myLinks/VIEW_SHARED_FILES')<string>(),

}

export type DashboardActions = ActionType<typeof DashboardActions>;
