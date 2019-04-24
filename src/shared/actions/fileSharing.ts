import { ActionType, createStandardAction } from 'typesafe-actions';
export interface FileRequest {
    ownerUserName: string,
    requestorUserName: string
    fileId: string
}
export interface FileInfo{
    path: string;
    type: string;
    size: number;
}
export interface LinkMessageEnvelope<T> {
    type:string
    sessionDescription: any,
    payload: T,
    timestamp: number,
    id: string
}

export const FileSharingActions = {
    requestFile: createStandardAction('fileSharing/REQUEST_FILE')<FileRequest>(),
    sendLinkMessage: createStandardAction('fileSharing/SEND_LINK_MESSAGE')<LinkMessageEnvelope<any>>(),
    offerEnvelopeReceived: createStandardAction('fileSharing/OFFER_ENVELOPE_RECEIVED')<LinkMessageEnvelope<FileRequest>>(),
    answerEnvelopeReceived: createStandardAction('fileSharing/ANSWER_ENVELOPE_RECEIVED')<LinkMessageEnvelope<FileInfo>>(),
};
export type FileSharingActions = ActionType<typeof FileSharingActions>;
