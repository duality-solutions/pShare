export interface GetUsersEntry {
    _id: string
    version: number,
    domain_component: string,
    common_name: string,
    organizational_unit: string,
    organization_name: string,
    object_id: string,
    object_full_path: string,
    object_type: string,
    wallet_address: string,
    public: number,
    dht_publickey: string,
    link_address: string,
    txid: string,
    time: number,
    expires_on: number,
    expired: boolean
}