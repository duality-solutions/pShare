import { BdapUserState } from "./BdapUserState";
import { PendingLink } from "../../dynamicdInterfaces/links/PendingLink";
export interface BdapUser {
    userName: string;
    commonName: string;
    state: BdapUserState;
    pendingLink?: PendingLink
}
