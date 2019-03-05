import * as React from 'react';
import { DashboardContainer, SidebarContainer, MainContentContainer } from '../ui-elements/Dashboard';
import { Sidebar } from '../../containers/dashboard/Sidebar';
import { Route, Switch, RouteComponentProps } from 'react-router';
import { dashboardRoutes } from "../../routes/appRoutes";
import { FunctionComponent } from 'react';
import { keys } from '../../../shared/system/entries';


export const Dashboard: FunctionComponent<RouteComponentProps<any>> =

    (props) =>
        <>
            <DashboardContainer>
                <SidebarContainer>
                    <Sidebar />
                </SidebarContainer>
                <MainContentContainer>
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



