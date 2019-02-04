export interface SyncState {
    chain_name: string;
    version: number;
    peers: number;
    headers: number;
    blocks: number;
    current_block_height: number;
    sync_progress: number;
    status_description: string;
    fully_synced: boolean;
    failed: boolean;
}
