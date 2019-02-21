import * as React from 'react';
import { DashboardContainer, SidebarContainer, MainContentContainer } from '../ui-elements/Dashboard';
import { Sidebar } from './Sidebar';
import { Route, Switch } from 'react-router';
import { dashboardRoutes } from "../../routes/appRoutes";

export default 
    (props: any) =>
    <>
    <DashboardContainer>
        <SidebarContainer>
            <Sidebar {...props}/>
        </SidebarContainer>
        <MainContentContainer>
         <Switch>
             {(Object.keys(dashboardRoutes) as Array<keyof typeof dashboardRoutes>)
                    .map((key, idx) =>
                         <Route key={idx} exact path={dashboardRoutes[key].path} component={dashboardRoutes[key].component} />
                     )}
         </Switch> 
        </MainContentContainer>
    </DashboardContainer>
    </>



