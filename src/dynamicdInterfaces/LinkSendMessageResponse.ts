export interface LinkSendMessageResponse {
    timestamp_epoch: number;
    shared_pubkey: string;
    subject_id: string;
    message_id: string;
    message_hash: string;
    message_size: number;
    signature_size: number;
    check_signature: string;
}
