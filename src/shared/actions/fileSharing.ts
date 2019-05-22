import { ActionType, createStandardAction } from 'typesafe-actions';
import { FileRequest } from './payloadTypes/FileRequest';
import { FileInfo } from './payloadTypes/FileInfo';
import { LinkMessageEnvelope } from './payloadTypes/LinkMessageEnvelope';
import { FileRequestWithSavePath } from './payloadTypes/FileRequestWithSavePath';
export const FileSharingActions = {
    requestFile: createStandardAction('fileSharing/REQUEST_FILE')<FileRequest>(),
    requestFileWithSavePath: createStandardAction('fileSharing/REQUEST_FILE_WITH_SAVE_PATH')<FileRequestWithSavePath>(),
    offerEnvelopeReceived: createStandardAction('fileSharing/OFFER_ENVELOPE_RECEIVED')<LinkMessageEnvelope<FileRequest>>(),
    answerEnvelopeReceived: createStandardAction('fileSharing/ANSWER_ENVELOPE_RECEIVED')<LinkMessageEnvelope<FileInfo>>()
};
export type FileSharingActions = ActionType<typeof FileSharingActions>;
