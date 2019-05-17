import { Link } from "./Link";
export interface CompleteLink extends Link {
    shared_accept_pubkey: string;
    recipient_wallet_address: string;
    recipient_link_pubkey: string;
    accept_txid: string;
    accept_time: number;
    accept_expires_on: number;
    accept_expired: boolean;
}
