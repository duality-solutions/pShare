import { BdapActions } from "../actions/bdap";
// import { getRandomNames } from "../system/mockData/getRandomName";
// import * as seedrandom from "seedrandom";
import { getType } from "typesafe-actions";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";

export interface BdapState {
    users: BdapUser[]
}
type BdapUserState = "normal" | "pending" | "linked" //mock states fttb
export interface BdapUser {
    userName: string
    commonName: string
    state: BdapUserState
    userInfoEntry: GetUserInfo
}

// const defaultState: BdapState = {
//     users: generateMockUsers()
// };

export const bdap = (state: BdapState = { users: [] }, action: BdapActions): BdapState => {
    switch (action.type) {
        case getType(BdapActions.getUsersSuccess):
            const userEntries = action.payload
            return { ...state, users: userEntries.map<BdapUser>(e => ({ commonName: e.common_name, userName: e.object_id, state: "normal", userInfoEntry: e })) }
    }
    return state
}

// function generateMockUsers() {
//     const regex = /\s+/;
//     const rng = seedrandom("foo");
//     const bdapUserStates: BdapUserState[] = ["normal", "linked", "pending"];
//     const mockUsers: BdapUser[] = getRandomNames(50, "someseed")
//         .map<BdapUser>(name => ({
//             userName: name.toLowerCase().replace(regex, ""),
//             commonName: name,
//             state: bdapUserStates[((rng() * bdapUserStates.length) >> 0)]
//         }));
//     return mockUsers;
// }
