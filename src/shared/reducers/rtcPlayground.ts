import { RtcActions } from "../actions/rtc";
import { getType } from "typesafe-actions";
interface RtcPlaygroundState {
    text: string
}
const defaultState: RtcPlaygroundState = { text: "" }
export const rtcPlayground = (state: RtcPlaygroundState = defaultState, action: RtcActions) => {
    switch (action.type) {
        case getType(RtcActions.createAnswerSuccess):
            return { ...state, text: action.payload }
        case getType(RtcActions.createOfferSuccess):
            return { ...state, text: action.payload }
        case getType(RtcActions.textChanged):
            return { ...state, text: action.payload }
        default:
            return state
    }
}