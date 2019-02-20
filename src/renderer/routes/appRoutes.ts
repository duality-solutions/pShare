import { push } from 'connected-react-router';
import { RouteComponentProps } from 'react-router';
import { deepFreeze } from '../../shared/system/deepFreeze';
import Dashboard from "../components/dashboard";
import { CreatingBdapAccount } from "../components/onboarding/CreatingBdapAccount";
import { PasswordGet } from '../components/onboarding/PasswordGet';
import CreateAccount from "../containers/onboarding/CreateAccount";
import EnterCommonName from "../containers/onboarding/EnterCommonName";
import EnterToken from "../containers/onboarding/EnterToken";
import EnterUserName from "../containers/onboarding/EnterUserName";
import MnemonicPage from '../containers/onboarding/MnemonicPage';
import MnemonicWarning from '../containers/onboarding/MnemonicWarning';
import PasswordCreate from '../containers/onboarding/PasswordCreate';
import SecureMnemonicFile from '../containers/onboarding/SecureMnemonicFile';
import Sync from "../containers/syncing/Sync";
import SyncAgree from "../containers/syncing/SyncAgree";
import MyLinks from '../containers/dashboard/MyLinks';

export interface RouteInfo {
    path: string;
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

const route = (path: string, component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>): RouteInfo => ({ path, component })

const routingTable = {
    syncAgree: route("/SyncAgree", SyncAgree),
    sync: route("/Sync", Sync),
    createAccount: route("/CreateAccount", CreateAccount),
    enterUserName: route("/EnterUserName", EnterUserName),
    enterCommonName: route("/EnterCommonName", EnterCommonName),
    enterToken: route("/EnterToken", EnterToken),
    creatingBdapAccount: route("/CreatingBdapAccount", CreatingBdapAccount),
    passwordCreate: route("/PasswordCreate", PasswordCreate),
    mnemonicWarning: route("/MnemonicWarning", MnemonicWarning),
    mnemonicPage: route("/MnemoniPage", MnemonicPage),
    secureMnemonicFile: route("/SecureMnemonicFile", SecureMnemonicFile),
    dashboard: route("/Dashboard", Dashboard),
    passwordGet: route("/PasswordGet",PasswordGet)
};

const dashboardRoutingTable = {
    myLinks : route("/Dashboard/MyLinks", MyLinks)
}
export const pushRoute = (route: RouteInfo) => push(route.path)

deepFreeze(routingTable)
deepFreeze(dashboardRoutingTable)

export const appRoutes = routingTable
export const dashboardRoutes = dashboardRoutingTable