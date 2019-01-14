import { ActionType, createStandardAction } from 'typesafe-actions';

interface SyncProgressReport{
    completionPercent:number
}

const AppActions = {
    initializeApp: createStandardAction('app/INITIALIZE')<void>(),
    waitingForSync: createStandardAction('app/WAITING_FOR_SYNC')<void>(),
    waitingForUserSyncAgreement: createStandardAction('app/WAITING_FOR_USER_SYNC_AGREEMENT')<void>(),
    syncProgress: createStandardAction('app/SYNC_PROGRESS')<SyncProgressReport>(),
    syncComplete: createStandardAction('app/SYNC_COMPLETE')<void>()
}

type AppActions = ActionType<typeof AppActions>;

export default AppActions