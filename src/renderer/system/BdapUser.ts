import { BdapUserState } from "./BdapUserState";
export interface BdapUser {
    userName: string;
    commonName: string;
    state: BdapUserState;
}
