import { BdapActions } from "../actions/bdap";
import { getRandomNames } from "../system/mockData/getRandomName";
import seedrandom from "seedrandom";

export interface BdapState {
    users: BdapUser[]
}
type BdapUserState = "normal" | "pending" | "linked" //mock states fttb
export interface BdapUser {
    userName: string
    commonName: string
    state: BdapUserState
}
const regex = /\s+/;
const rng = seedrandom("foo")
const bdapUserStates: BdapUserState[] = ["normal", "linked", "pending"]
const mockUsers: BdapUser[] =
    getRandomNames(50, "someseed")
        .map<BdapUser>(n => ({
            userName: n.toLowerCase().replace(regex, ""),
            commonName: n,
            state: bdapUserStates[((rng() * bdapUserStates.length) >> 0)]
        }))

const defaultState: BdapState = {
    users: mockUsers
};

export const bdap = (state: BdapState = defaultState, action: BdapActions): BdapState => {
    return state
}