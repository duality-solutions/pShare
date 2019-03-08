import { ActionType, createStandardAction } from 'typesafe-actions';

// ensure this is added to ./index.ts RootActions
export const RtcActions = {
    rtcStoreReady: createStandardAction('rtc/STORE_READY')<void>(),
    createOffer: createStandardAction('rtc/CREATE_OFFER')<void>(),
    createOfferSuccess: createStandardAction('rtc/CREATE_OFFER_SUCCESS')<string>(),
    createAnswer: createStandardAction('rtc/CREATE_ANSWER')<string>(),
    createAnswerSuccess: createStandardAction('rtc/CREATE_ANSWER_SUCCESS')<string>(),
}

export type RtcActions = ActionType<typeof RtcActions>;

