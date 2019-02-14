import { push } from 'connected-react-router';
import { RouteComponentProps } from 'react-router';
import { deepFreeze } from '../../shared/system/deepFreeze';
import { Main } from "../components/Main";
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
    main: route("/Main", Main),
    passwordGet: route("/PasswordGet",PasswordGet)
};

export const pushRoute = (route: RouteInfo) => push(route.path)

deepFreeze(routingTable)

export const appRoutes = routingTable