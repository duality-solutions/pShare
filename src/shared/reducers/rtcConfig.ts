import { RootActions } from "../actions";
const rtcDefaultState: RTCConfiguration = {
    iceServers: [
        { urls: 'turn:45.77.158.163:3478', username: "test", credential: "Admin@123", }
    ],
};
export const rtcConfig = (state: RTCConfiguration = rtcDefaultState, action: RootActions): RTCConfiguration => {
    return state;
};
