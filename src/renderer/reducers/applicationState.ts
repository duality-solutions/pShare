import { getType } from 'typesafe-actions';
import { DashboardActions } from '../../shared/actions/dashboard';

interface ApplicationState {
    spinner: boolean
}

const defaultState: ApplicationState = {
    spinner: false
}

export const applicationState = ( state: ApplicationState = defaultState, action:DashboardActions ): ApplicationState => {
    switch(action.type) {
        case(getType(DashboardActions.toggleSpinner)): 
            return { ...state, spinner: !state.spinner };
        default:
            return state
    }
}