import { RouteComponentProps } from 'react-router';
import { Main } from "../components/Main";
import CreateAccount from "../containers/onboarding/CreateAccount";
import EnterCommonName from "../containers/onboarding/EnterCommonName";
import EnterToken from "../containers/onboarding/EnterToken";
import EnterUserName from "../containers/onboarding/EnterUserName";
import Sync from "../containers/syncing/Sync";
import SyncAgree from "../containers/syncing/SyncAgree";
import { CreatingBdapAccount } from "../components/onboarding/CreatingBdapAccount";
import { deepFreeze } from '../../shared/system/deepFreeze';
import { push } from 'connected-react-router';
import PasswordCreate from '../containers/onboarding/PasswordCreate';

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
    main: route("/Main", Main)
};
export const pushRoute = (route: RouteInfo) => push(route.path)

deepFreeze(routingTable)

export const appRoutes = routingTable