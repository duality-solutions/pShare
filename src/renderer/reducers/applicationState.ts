import { getType } from 'typesafe-actions';
import { DashboardActions } from '../../shared/actions/dashboard';
import { FileListActions } from '../../shared/actions/fileList';

interface ApplicationState {
    spinner: boolean
    dashboardReady: boolean
}

const defaultState: ApplicationState = {
    spinner: false,
    dashboardReady: false
}

export const applicationState = (state: ApplicationState = defaultState, action: DashboardActions | FileListActions): ApplicationState => {
    switch (action.type) {
        case (getType(DashboardActions.toggleSpinner)):
            return { ...state, spinner: !state.spinner };
        case getType(FileListActions.fileListPublished):
            return { ...state, dashboardReady: true }
        default:
            return state
    }
}