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

export function isLink(obj: any): obj is Link {
    const requiredProps = [
        "requestor_fqdn",
        "recipient_fqdn",
        "txid",
        "time",
        "expires_on",
        "expired"
    ]
    if (obj == null || typeof obj !== "object") return false
    return requiredProps.every(p => obj.hasOwnProperty(p))
}
