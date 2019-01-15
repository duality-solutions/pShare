import { ExpectedMonitoringState } from "./ExpectedMonitoringState";
const expectedMonitoringStates: ExpectedMonitoringState[] = [
    {
        stageIndex: 0,
        state: {
            AssetName: 'DYNODE_SYNC_INITIAL',
            IsBlockchainSynced: false,
            IsDynodeListSynced: false,
            IsWinnersListSynced: false,
            IsSynced: false,
            IsFailed: false
        }
    },
    {
        stageIndex: 1,
        state: {
            AssetName: "DYNODE_SYNC_WAITING",
            IsBlockchainSynced: false,
            IsDynodeListSynced: false,
            IsWinnersListSynced: false,
            IsSynced: false,
            IsFailed: false
        }
    },
    {
        stageIndex: 2,
        state: {
            AssetName: "DYNODE_SYNC_LIST",
            IsBlockchainSynced: true,
            IsDynodeListSynced: false,
            IsWinnersListSynced: false,
            IsSynced: false,
            IsFailed: false
        }
    },
    {
        stageIndex: 3,
        state: {
            AssetName: "DYNODE_SYNC_DNW",
            IsBlockchainSynced: true,
            IsDynodeListSynced: true,
            IsWinnersListSynced: false,
            IsSynced: false,
            IsFailed: false
        }
    },
    {
        stageIndex: 4,
        state: {
            AssetName: "DYNODE_SYNC_GOVERNANCE",
            IsBlockchainSynced: true,
            IsDynodeListSynced: true,
            IsWinnersListSynced: true,
            IsSynced: false,
            IsFailed: false
        }
    },
    {
        stageIndex: 5,
        state: {
            AssetName: "DYNODE_SYNC_FINISHED",
            IsBlockchainSynced: true,
            IsDynodeListSynced: true,
            IsWinnersListSynced: true,
            IsSynced: true,
            IsFailed: false
        }
    },
    {
        // negative numbers for fail-state
        stageIndex: -1,
        state: {
            AssetName: "DYNODE_SYNC_FAILED",
            IsFailed: true
        }
    },
];

export const getExpectedMonitoringStates = () => expectedMonitoringStates