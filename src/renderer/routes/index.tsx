import * as React from "react";
import { Route, Switch } from 'react-router'
import Sync from "../containers/Sync";
import { Main } from "../components/Main";
import SyncAgree from "../containers/SyncAgree";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "../components/ui-elements/GlobalStyle";

const appTheme = {
    blue : '#2e77d0'
}

export default
    <>
    <GlobalStyle />
    <ThemeProvider theme={appTheme}>
    <Switch>
        <Route exact path="/Sync" component={Sync} />
        <Route exact path="/SyncAgree" component={SyncAgree} />
        <Route exact path="/Main" component={Main} />
    </Switch>
    </ThemeProvider>
    </>