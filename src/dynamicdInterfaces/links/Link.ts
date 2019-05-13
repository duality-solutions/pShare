export interface Link {
    "requestor_fqdn": string,
    "recipient_fqdn": string,
    "shared_request_pubkey": string,
    "requestor_wallet_address":string,
    "requestor_link_pubkey": string,
    "txid": string,
    "time": number,
    "expires_on": number,
    "expired": boolean,
    "link_message": string
}

export function isLink(obj: any): obj is Link {
    const requiredProps = [
        "requestor_fqdn",
        "recipient_fqdn",
        "shared_request_pubkey",
        "requestor_wallet_address",
        "requestor_link_pubkey",
        "txid",
        "time",
        "expires_on",
        "expired",
        "link_message"
        ]
    if (obj == null || typeof obj !== "object") return false
    return requiredProps.every(p => obj.hasOwnProperty(p))
}
