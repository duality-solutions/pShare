import { ActionType, createStandardAction } from 'typesafe-actions';
export interface FileRequest {
    ownerUserName: string,
    requestorUserName: string
    fileId: string
}
export interface LinkMessageEnvelope<T> {
    sessionDescription: any,
    payload: T,
    timestamp: number,
    id: string
}

export const FileSharingActions = {
    requestFile: createStandardAction('fileSharing/REQUEST_FILE')<FileRequest>(),
    sendOfferEnvelope: createStandardAction('fileSharing/SEND_OFFER_ENVELOPE')<LinkMessageEnvelope<FileRequest>>(),
    offerEnvelopeReceived: createStandardAction('fileSharing/OFFER_ENVELOPE_RECEIVED')<LinkMessageEnvelope<FileRequest>>(),
    answerEnvelopeReceived: createStandardAction('fileSharing/ANSWER_ENVELOPE_RECEIVED')<LinkMessageEnvelope<FileRequest>>(),
};
export type FileSharingActions = ActionType<typeof FileSharingActions>;
