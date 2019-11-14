import { RootActions } from "../actions";
const rtcDefaultState: RTCConfiguration = {
    iceServers: [
        { urls: 'turn:ice.bdap.io:3478', username: "test", credential: "Admin@123", }
    ],
};
export const rtcConfig = (state: RTCConfiguration = rtcDefaultState, action: RootActions): RTCConfiguration => {
    return state;
};
