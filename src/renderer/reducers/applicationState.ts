import { getType } from 'typesafe-actions';
import { DashboardActions } from '../../shared/actions/dashboard';
import { BdapActions } from '../../shared/actions/bdap';

interface ApplicationState {
    spinner: boolean
    dashboardReady: boolean
}

const defaultState: ApplicationState = {
    spinner: false,
    dashboardReady: false
}

export const applicationState = (state: ApplicationState = defaultState, action: DashboardActions | BdapActions): ApplicationState => {
    switch (action.type) {
        case (getType(DashboardActions.toggleSpinner)):
            return { ...state, spinner: !state.spinner };
        case getType(BdapActions.bdapDataFetchSuccess):
            return { ...state, dashboardReady: true }
        default:
            return state
    }
}