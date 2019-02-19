import { BdapActions } from "../actions/bdap";
import { getRandomNames } from "../system/mockData/getRandomName";

export interface BdapState {
    users: BdapUser[]
}
type BdapUserState = "normal" | "linked" //mock states fttb
export interface BdapUser {
    userName: string
    commonName: string
    state: BdapUserState
}
const regex = /\s+/;
const mockUsers: BdapUser[] =
    getRandomNames(50, "someseed")
        .map<BdapUser>(n => ({
            userName: n.toLowerCase().replace(regex, ""),
            commonName: n,
            state: "normal"
        }))

const defaultState: BdapState = {
    users: mockUsers
};

export const bdap = (state: BdapState = defaultState, action: BdapActions): BdapState => {
    return state
}