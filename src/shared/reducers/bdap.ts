import { BdapActions } from "../actions/bdap";
import { getRandomNames } from "../system/mockData/getRandomName";
import * as seedrandom from "seedrandom";

export interface BdapState {
    users: BdapUser[]
}
type BdapUserState = "normal" | "pending" | "linked" //mock states fttb
export interface BdapUser {
    userName: string
    commonName: string
    state: BdapUserState
}

const defaultState: BdapState = {
    users: generateMockUsers()
};

export const bdap = (state: BdapState = defaultState, action: BdapActions): BdapState => {
    return state
}

function generateMockUsers() {
    const regex = /\s+/;
    const rng = seedrandom("foo");
    const bdapUserStates: BdapUserState[] = ["normal", "linked", "pending"];
    const mockUsers: BdapUser[] = getRandomNames(50, "someseed")
        .map<BdapUser>(name => ({
            userName: name.toLowerCase().replace(regex, ""),
            commonName: name,
            state: bdapUserStates[((rng() * bdapUserStates.length) >> 0)]
        }));
    return mockUsers;
}
