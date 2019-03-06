import { ActionType, createStandardAction } from 'typesafe-actions';

// ensure this is added to ./index.ts RootActions
export const RtcActions = {
    rtcStoreReady: createStandardAction('rtc/STORE_READY')<void>(),
    rtcSessiondescriptionReceived: createStandardAction('rtc/SESSION_DESCRIPTION_RECEIVED')<string>(),
}

export type RtcActions = ActionType<typeof RtcActions>;

