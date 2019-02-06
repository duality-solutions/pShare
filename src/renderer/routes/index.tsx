import * as React from "react";
import { Route, Switch } from 'react-router';
import { ThemeProvider } from "styled-components";
import { Main } from "../components/Main";
import GlobalStyle from "../components/ui-elements/GlobalStyle";
import CreateAccount from "../containers/onboarding/CreateAccount";
import EnterCommonName from "../containers/onboarding/EnterCommonName";
import EnterToken from "../containers/onboarding/EnterToken";
import EnterUserName from "../containers/onboarding/EnterUserName";
import Sync from "../containers/syncing/Sync";
import SyncAgree from "../containers/syncing/SyncAgree";
import { CreatingBdapAccount } from "../components/onboarding/CreatingBdapAccount";
import { Password } from "../components/onboarding/Password";

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
        <Route exact path="/EnterUserName" component={EnterUserName} />
        <Route exact path="/EnterCommonName" component={EnterCommonName} />
        <Route exact path="/EnterToken" component={EnterToken} />
        <Route exact path="/CreatingBdapAccount" component={CreatingBdapAccount} />
        <Route exact path="/OnboardingPassword" component={Password} />
        <Route exact path="/Main" component={Main} />
    </Switch>
    </ThemeProvider>
    </>