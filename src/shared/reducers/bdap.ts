import { BdapActions } from "../actions/bdap";
// import { getRandomNames } from "../system/mockData/getRandomName";
// import * as seedrandom from "seedrandom";
import { getType } from "typesafe-actions";
import { GetUserInfo } from "../../dynamicdInterfaces/GetUserInfo";
import { PendingLink } from "../../dynamicdInterfaces/links/PendingLink";
import { Link } from "../../dynamicdInterfaces/links/Link";
import { AppActions } from "../actions/app";
import { deleteOptionalProperty } from "../system/deleteOptionalProperty";
import { DeniedLink } from "../../dynamicdInterfaces/DeniedLink";

export interface BdapState {
    users: GetUserInfo[]
    pendingAcceptLinks: PendingLink[]
    pendingRequestLinks: PendingLink[]
    completeLinks: Link[]
    deniedLinks: DeniedLink[]
    currentUser?: GetUserInfo,
    balance: number
}
const defaultState: BdapState = { users: [], pendingAcceptLinks: [], pendingRequestLinks: [], completeLinks: [], deniedLinks: [], balance: 0 };
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

export const bdap = (state: BdapState = defaultState, action: BdapActions | AppActions): BdapState => {
    switch (action.type) {
        case getType(BdapActions.getUsersSuccess):
            const users = action.payload
            return { ...state, users }
        case getType(BdapActions.currentUserReceived):
            const currentUser = action.payload
            return { ...state, currentUser }
        case getType(BdapActions.getPendingAcceptLinksSuccess):
            const pendingAcceptLinks = action.payload
            return { ...state, pendingAcceptLinks }
        case getType(BdapActions.getPendingRequestLinksSuccess):
            const pendingRequestLinks = action.payload
            return { ...state, pendingRequestLinks }
        case getType(BdapActions.getCompleteLinksSuccess):
            const completeLinks = action.payload
            return { ...state, completeLinks }
        case getType(BdapActions.getDeniedLinksSuccess):
            const deniedLinks = action.payload
            return { ...state, deniedLinks }
        case getType(BdapActions.getBalanceSuccess):
            return { ...state, balance: action.payload }
        case getType(AppActions.initializeApp):
            return {
                ...deleteOptionalProperty(state, "currentUser"),
                completeLinks: [],
                pendingAcceptLinks: [],
                pendingRequestLinks: [],
                users: []
            }
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
