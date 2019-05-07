import * as React from 'react';
import { DashboardContainer, SidebarContainer, MainContentContainer } from '../ui-elements/Dashboard';
import { Sidebar } from '../../containers/dashboard/Sidebar';
import { Route, Switch, RouteComponentProps } from 'react-router';
import { dashboardRoutes } from "../../routes/appRoutes";
import { FunctionComponent } from 'react';
import { keys } from '../../../shared/system/entries';
import LoadingSpinner from '../ui-elements/LoadingSpinner';

export interface DashboardStateProps {
    spinner: boolean
    dashboardReady: boolean
}

export type DashboardProps = FunctionComponent<RouteComponentProps<any> & DashboardStateProps>

export const Dashboard: DashboardProps =
    ({ spinner, dashboardReady }) =>
        <>
            <DashboardContainer>
                <SidebarContainer>
                    <Sidebar />
                </SidebarContainer>
                <MainContentContainer disabled={spinner}>
                    <LoadingSpinner active={spinner || !dashboardReady} />
                    <Switch>{
                        keys(dashboardRoutes)
                            .select((key, idx) =>
                                <Route key={idx} exact path={dashboardRoutes[key].path} component={dashboardRoutes[key].component} />
                            )
                    }
                    </Switch>
                </MainContentContainer>
            </DashboardContainer>
        </>



