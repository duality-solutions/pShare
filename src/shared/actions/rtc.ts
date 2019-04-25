import { ActionType, createStandardAction } from 'typesafe-actions';
import { FileRequest } from './fileSharing';

interface FileReceiveFailure{
    error:any,
    fileRequest:FileRequest
}
interface FileReceiveProgress{
    totalBytes:number
    downloadedBytes:number
    fileRequest:FileRequest
}

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
    fileReceiveProgress: createStandardAction('rtc/FILE_RECEIVE_PROGRESS')<FileReceiveProgress>(),
    fileReceiveSuccess: createStandardAction('rtc/FILE_RECEIVE_SUCCESS')<FileRequest>(),
    fileReceiveFailed: createStandardAction('rtc/FILE_RECEIVE_FAILED')<FileReceiveFailure>(),

    textChanged: createStandardAction('rtc/TEXT_CHANGED')<string>(),

}

export type RtcActions = ActionType<typeof RtcActions>;


