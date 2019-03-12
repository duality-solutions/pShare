import * as React from "react";
import { Route, Switch } from 'react-router';
import { ThemeProvider } from "styled-components";
import GlobalStyle from "../components/ui-elements/GlobalStyle";
import { appRoutes } from "./appRoutes";

const appTheme = {
    blue: '#2e77d0'
}


export default
    <>
        <GlobalStyle />
        <ThemeProvider theme={appTheme}>
            <Switch>
                {(Object.keys(appRoutes) as Array<keyof typeof appRoutes>)
                    .map((key, idx) =>
                        <Route key={idx} exact={appRoutes[key].exact} path={appRoutes[key].path} component={appRoutes[key].component} />
                    )}
                {/* <Route path="/Rtc" exact component={RtcPlayground} /> */}
            </Switch>
        </ThemeProvider>
    </>