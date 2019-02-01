import * as React from "react";
import { Route, Switch } from 'react-router';
import { ThemeProvider } from "styled-components";
import { Main } from "../components/Main";
import GlobalStyle from "../components/ui-elements/GlobalStyle";
import CreateAccount from "../containers/onboarding/CreateAccount";
import EnterDisplayName from "../containers/onboarding/EnterDisplayName";
import EnterToken from "../containers/onboarding/EnterToken";
import EnterUsername from "../containers/onboarding/EnterUsername";
import Sync from "../containers/syncing/Sync";
import SyncAgree from "../containers/syncing/SyncAgree";

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
        <Route exact path="/EnterDisplaynName" component={EnterDisplayName} />
        <Route exact path="/EnterToken" component={EnterToken} />
        <Route exact path="/Main" component={Main} />
    </Switch>
    </ThemeProvider>
    </>