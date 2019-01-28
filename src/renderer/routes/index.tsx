import * as React from "react";
import { Route, Switch } from 'react-router';
import { ThemeProvider } from "styled-components";
import { Main } from "../components/Main";
import GlobalStyle from "../components/ui-elements/GlobalStyle";
import CreateAccount from "../containers/CreateAccount";
import EnterDisplayName from "../containers/EnterDisplayName";
import EnterUsername from "../containers/EnterUsername";
import Sync from "../containers/Sync";
import SyncAgree from "../containers/SyncAgree";

const appTheme = {
    blue : '#2e77d0'
}

export default
    <>
    <GlobalStyle />
    <ThemeProvider theme={appTheme}>
    <Switch>
        <Route exact path="/SyncAgree" component={SyncAgree} />
        <Route exact path="/Sync" component={Sync} />
        <Route exact path="/CreateAccount" component={CreateAccount} />
        <Route exact path="/EnterUsername" component={EnterUsername} />
        <Route exact path="/EnterDisplayname" component={EnterDisplayName} />
        <Route exact path="/Main" component={Main} />
    </Switch>
    </ThemeProvider>
    </>