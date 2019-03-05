import { ActionType, createStandardAction } from 'typesafe-actions';

// ensure this is added to ./index.ts RootActions
export const RtcActions = {
    rtcStoreReady: createStandardAction('rtc/STORE_READY')<void>(),
}

export type RtcActions = ActionType<typeof RtcActions>;

