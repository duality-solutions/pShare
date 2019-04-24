import { ActionType, createStandardAction } from 'typesafe-actions';
export interface FileRequest {
    ownerUserName: string,
    requestorUserName: string
    fileId: string
}
export interface OfferEnvelope<T> {
    sessionDescription: any,
    payload: T,
    timestamp: number,
    id: string
}

export const FileSharingActions = {
    requestFile: createStandardAction('fileSharing/REQUEST_FILE')<FileRequest>(),
    sendOfferEnvelope: createStandardAction('fileSharing/SEND_OFFER_ENVELOPE')<OfferEnvelope<FileRequest>>(),
    offerEnvelopeReceived: createStandardAction('fileSharing/OFFER_ENVELOPE_RECEIVED')<OfferEnvelope<FileRequest>>(),
};
export type FileSharingActions = ActionType<typeof FileSharingActions>;
