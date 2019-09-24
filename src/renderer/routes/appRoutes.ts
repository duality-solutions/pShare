import { push } from 'connected-react-router';
import { RouteComponentProps } from 'react-router';
import { deepFreeze } from '../../shared/system/deepFreeze';
import Dashboard from "../containers/dashboard";
import { CreatingBdapAccount } from "../components/onboarding/CreatingBdapAccount";
import { PasswordGet } from '../components/onboarding/PasswordGet';
import CreateAccount from "../containers/onboarding/CreateAccount";
import EnterCommonName from "../containers/onboarding/EnterCommonName";
import EnterToken from "../containers/onboarding/EnterToken";
import EnterUserName from "../containers/onboarding/EnterUserName";
import MnemonicPage from '../containers/onboarding/MnemonicPage';
import MnemonicWarning from '../containers/onboarding/MnemonicWarning';
import PasswordCreateOrLogin from '../containers/onboarding/PasswordCreateOrLogin';
import SecureMnemonicFile from '../containers/onboarding/SecureMnemonicFile';
import Sync from "../containers/syncing/Sync";
import SyncAgree from "../containers/syncing/SyncAgree";
import MyLinks from '../containers/dashboard/MyLinks';
import { Invites } from '../containers/dashboard/Invites';
import AddLinks from "../containers/dashboard/AddLinks";
import RestoreAccount from '../containers/onboarding_restore/RestoreAccount';
import RestoreWithMnemonicFile from '../containers/onboarding_restore/RestoreWithMnemonicFile';
import RestoreWithPassphrase from '../containers/onboarding_restore/RestoreWithPassphrase';
import RestoreSyncProgress from '../containers/onboarding_restore/RestoreSyncProgress';
import SecureFilePassword from '../containers/onboarding_restore/SecureFilePassword';
import SharedFiles from '../containers/dashboard/SharedFiles';
import AddFile from '../containers/dashboard/AddFile';
import BulkImport from '../containers/dashboard/BulkImport';
import { CreatingLinkProgress } from '../components/dashboard/CreatingLinkProgress';
import { ClientDownloads } from '../containers/dashboard/ClientDownloads';
export interface RouteInfo {
    path: string;
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    exact: boolean,
}

const route = (path: string, component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>, exact: boolean = true): RouteInfo => ({ path, component, exact })

const routingTable = {
    syncAgree: route("/SyncAgree", SyncAgree),
    sync: route("/Sync", Sync),
    createAccount: route("/CreateAccount", CreateAccount),
    enterUserName: route("/EnterUserName", EnterUserName),
    enterCommonName: route("/EnterCommonName", EnterCommonName),
    enterToken: route("/EnterToken", EnterToken),
    creatingBdapAccount: route("/CreatingBdapAccount", CreatingBdapAccount),
    passwordCreateOrLogin: route("/PasswordCreateOrLogin", PasswordCreateOrLogin),
    mnemonicWarning: route("/MnemonicWarning", MnemonicWarning),
    mnemonicPage: route("/MnemoniPage", MnemonicPage),
    secureMnemonicFile: route("/SecureMnemonicFile", SecureMnemonicFile),
    dashboard: route("/Dashboard", Dashboard, false),
    passwordGet: route("/PasswordGet", PasswordGet),
    restoreAccount: route('/RestoreAccount', RestoreAccount),
    restoreWithPassphrase: route('/RestoreWithPassphrase', RestoreWithPassphrase),
    restoreWithMnemonicFile: route('/RestoreWithMnemonicFile', RestoreWithMnemonicFile),
    restoreSyncProgress: route('/RestoreSyncProgress', RestoreSyncProgress),
    secureFilePassword: route('/SecureFilePassword', SecureFilePassword)
};

const dashboardRoutingTable = {
    myLinks: route("/Dashboard/MyLinks", MyLinks),
    invites: route("/Dashboard/Invites", Invites),
    addLinks: route("/Dashboard/AddLinks", AddLinks),
    sharedFiles: route("/Dashboard/SharedFiles", SharedFiles),
    addFile: route("/Dashboard/AddFile", AddFile),
    creatingLinkProgress: route("/Dashboard/CreatingLinkProgress", CreatingLinkProgress),
    clientDownloads: route("/Dashboard/Outbox", ClientDownloads),
    bulkImport: route("/Dashboard/BulkImport", BulkImport)
}
export const pushRoute = (route: RouteInfo) => push(route.path)

deepFreeze(routingTable)
deepFreeze(dashboardRoutingTable)

export const appRoutes = routingTable
export const dashboardRoutes = dashboardRoutingTable