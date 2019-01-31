export interface BlockChainInfo {
    chain: string;
    blocks: number;
    headers: number;
    bestblockhash: string;
    difficulty: string;
    mediantime: number;
    verificationprogress: string;
    chainwork: string;
    pruned: boolean;
}