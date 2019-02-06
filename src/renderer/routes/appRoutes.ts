import { RouteComponentProps } from 'react-router';
import { Main } from "../components/Main";
import CreateAccount from "../containers/onboarding/CreateAccount";
import EnterCommonName from "../containers/onboarding/EnterCommonName";
import EnterToken from "../containers/onboarding/EnterToken";
import EnterUserName from "../containers/onboarding/EnterUserName";
import Sync from "../containers/syncing/Sync";
import SyncAgree from "../containers/syncing/SyncAgree";
import { CreatingBdapAccount } from "../components/onboarding/CreatingBdapAccount";
import { PasswordCreate } from "../components/onboarding/PasswordCreate";
import { deepFreeze } from '../../shared/system/deepFreeze';
import { push } from 'connected-react-router';

export interface RouteInfo {
    path: string;
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

const routingTable = {
    syncAgree: {
        path: "/SyncAgree",
        component: SyncAgree
    } as RouteInfo,
    sync: {
        path: "/Sync",
        component: Sync
    } as RouteInfo,
    createAccount: {
        path: "/CreateAccount",
        component: CreateAccount
    } as RouteInfo,
    enterUserName: {
        path: "/EnterUserName",
        component: EnterUserName
    } as RouteInfo,
    enterCommonName: {
        path: "/EnterCommonName",
        component: EnterCommonName
    } as RouteInfo,
    enterToken: {
        path: "/EnterToken",
        component: EnterToken
    } as RouteInfo,
    creatingBdapAccount: {
        path: "/CreatingBdapAccount",
        component: CreatingBdapAccount
    } as RouteInfo,
    passwordCreate: {
        path: "/PasswordCreate",
        component: PasswordCreate
    } as RouteInfo,
    main: {
        path: "/Main",
        component: Main
    } as RouteInfo
};
export const pushRoute = (route: RouteInfo) => push(route.path)

deepFreeze(routingTable)

export const appRoutes = routingTable