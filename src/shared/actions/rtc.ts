import { ActionType, createStandardAction } from 'typesafe-actions';
import { FileRequest } from "./payloadTypes/FileRequest";
import { FileReceiveProgress } from './payloadTypes/FileReceiveProgress';
import { FileReceiveFailure } from './payloadTypes/FileReceiveFailure';

// ensure this is added to ./index.ts RootActions
export const RtcActions = {
    rtcStoreReady: createStandardAction('rtc/STORE_READY')<void>(),
    fileSendSuccess: createStandardAction('rtc/FILE_SEND_SUCCESS')<void>(),
    fileSendFailed: createStandardAction('rtc/FILE_SEND_FAILED')<{}>(),
    fileReceiveProgress: createStandardAction('rtc/FILE_RECEIVE_PROGRESS')<FileReceiveProgress>(),
    fileReceiveSuccess: createStandardAction('rtc/FILE_RECEIVE_SUCCESS')<FileRequest>(),
    fileReceiveFailed: createStandardAction('rtc/FILE_RECEIVE_FAILED')<FileReceiveFailure>(),
}

export type RtcActions = ActionType<typeof RtcActions>;


