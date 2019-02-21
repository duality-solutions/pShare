import { BdapActions } from "../actions/bdap";
// import { getRandomNames } from "../system/mockData/getRandomName";
// import * as seedrandom from "seedrandom";
import { getType } from "typesafe-actions";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";
import { PendingLink } from "../../dynamicdInterfaces/links/PendingLink";
import { Link } from "../../dynamicdInterfaces/links/Link";

export interface BdapState {
    users: GetUserInfo[]
    pendingAcceptLinks: PendingLink[]
    pendingRequestLinks: PendingLink[]
    completeLinks: Link[]
}
const defaultState: BdapState = { users: [], pendingAcceptLinks: [], pendingRequestLinks: [], completeLinks: [] };
// type BdapUserState = "normal" | "pending" | "linked" //mock states fttb
// export interface BdapUser {
//     userName: string
//     commonName: string
//     state: BdapUserState
//     userInfoEntry: GetUserInfo
// }

// const defaultState: BdapState = {
//     users: generateMockUsers()
// };

export const bdap = (state: BdapState = defaultState, action: BdapActions): BdapState => {
    switch (action.type) {
        case getType(BdapActions.getUsersSuccess):
            const users = action.payload
            return { ...state, users }
        case getType(BdapActions.getPendingAcceptLinksSuccess):
            const pendingAcceptLinks = action.payload
            return { ...state, pendingAcceptLinks }
        case getType(BdapActions.getPendingRequestLinksSuccess):
            const pendingRequestLinks = action.payload
            return { ...state, pendingRequestLinks }
        case getType(BdapActions.getCompleteLinksSuccess):
            const completeLinks = action.payload
            return { ...state, completeLinks }
        default:
            return state

    }
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
