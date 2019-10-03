import { ActionType, createStandardAction } from 'typesafe-actions';
import { FileRequest } from './payloadTypes/FileRequest';
import { FileInfo } from './payloadTypes/FileInfo';
import { LinkMessageEnvelope } from './payloadTypes/LinkMessageEnvelope';
import { SessionDescriptionEnvelope } from './payloadTypes/SessionDescriptionEnvelope';
export const FileSharingActions = {
    requestFile: createStandardAction('fileSharing/REQUEST_FILE')<FileRequest>(),
    startRequestFile: createStandardAction('fileSharing/START_REQUEST_FILE')<FileRequest>(),
    offerEnvelopeReceived: createStandardAction('fileSharing/OFFER_ENVELOPE_RECEIVED')<LinkMessageEnvelope<SessionDescriptionEnvelope<FileRequest>>>(),
    answerEnvelopeReceived: createStandardAction('fileSharing/ANSWER_ENVELOPE_RECEIVED')<LinkMessageEnvelope<SessionDescriptionEnvelope<FileInfo>>>()
};
export type FileSharingActions = ActionType<typeof FileSharingActions>;



