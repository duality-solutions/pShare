interface LinkRequest {
    requestor_fqdn: string;
    recipient_fqdn: string;
    requestor_link_pubkey: string;
    requestor_link_address: string;
    recipient_link_address: string;
    link_message: string;
    signature_proof: string;
    txid: string;
    time: number;
    expires_on: number;
    expired: boolean;
}
