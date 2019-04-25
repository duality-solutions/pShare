import { ActionType, createStandardAction } from 'typesafe-actions';

// ensure this is added to ./index.ts RootActions
export const RtcActions = {
    rtcStoreReady: createStandardAction('rtc/STORE_READY')<void>(),
    createOffer: createStandardAction('rtc/CREATE_OFFER')<void>(),
    createOfferSuccess: createStandardAction('rtc/CREATE_OFFER_SUCCESS')<string>(),
    createAnswer: createStandardAction('rtc/CREATE_ANSWER')<void>(),
    createAnswerSuccess: createStandardAction('rtc/CREATE_ANSWER_SUCCESS')<string>(),
    setAnswerFromRemote: createStandardAction('rtc/SET_ANSWER_FROM_REMOTE')<void>(),

    fileSendSuccess: createStandardAction('rtc/FILE_SEND_SUCCESS')<void>(),
    fileSendFailed: createStandardAction('rtc/FILE_SEND_FAILED')<{}>(),
    fileReceiveSuccess: createStandardAction('rtc/FILE_RECEIVE_SUCCESS')<void>(),
    fileReceiveFailed: createStandardAction('rtc/FILE_RECEIVE_FAILED')<{}>(),

    textChanged: createStandardAction('rtc/TEXT_CHANGED')<string>(),

}

export type RtcActions = ActionType<typeof RtcActions>;


