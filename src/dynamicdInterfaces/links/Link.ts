export interface Link {
    requestor_fqdn: string;
    recipient_fqdn: string;
    requestor_link_pubkey?: string;
    recipient_link_pubkey?: string;
    txid: string;
    time: number;
    expires_on: number;
    expired: boolean;
}
