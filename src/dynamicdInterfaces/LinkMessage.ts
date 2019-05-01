export interface LinkMessage {
    sender_fqdn: string;
    type: string;
    message: string;
    message_id: string;
    message_size: number;
    timestamp_epoch: number;
    record_num: number;
}
