import { ActionType, createStandardAction } from 'typesafe-actions';

interface SyncProgressReport{
    completionPercent:number
}

const SyncActions = {
    waitingForSync: createStandardAction('sync/WAITING_FOR_SYNC')<void>(),
    waitingForUserSyncAgreement: createStandardAction('sync/WAITING_FOR_USER_SYNC_AGREEMENT')<void>(),
    syncProgress: createStandardAction('sync/SYNC_PROGRESS')<SyncProgressReport>(),
    syncComplete: createStandardAction('sync/SYNC_COMPLETE')<void>()
}

type SyncActions = ActionType<typeof SyncActions>;

// ensure this is added to ./index.ts RootActions
export default SyncActions