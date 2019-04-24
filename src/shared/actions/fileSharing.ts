import { ActionType, createStandardAction } from 'typesafe-actions';
export interface FileRequest {
    userName: string,
    fileId: string
}
export interface OfferEnvelope<T> {
    sessionDescription:any,
    payload:T,
    timestamp:number,
    id:string
}

export const FileSharingActions = {
    requestFile: createStandardAction('fileSharing/REQUEST_FILE')<FileRequest>(),
    sendOfferEnvelope: createStandardAction('fileSharing/SEND_OFFER_ENVELOPE')<OfferEnvelope<FileRequest>>()
};
export type FileSharingActions = ActionType<typeof FileSharingActions>;
