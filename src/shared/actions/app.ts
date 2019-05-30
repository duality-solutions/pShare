import { ActionType, createStandardAction } from 'typesafe-actions';

interface LogMessage{
    args:any[],
    level:"error"|"warn"|"log"|"info"
}

// ensure this is added to ./index.ts RootActions
export const AppActions = {
    initializeApp: createStandardAction('app/INITIALIZE')<void>(),
    appInitialized: createStandardAction('app/INITIALIZED')<void>(),
    shuttingDown: createStandardAction('app/SHUTTING_DOWN')<void>(),
    shutdownAborted: createStandardAction('app/SHUTDOWN_ABORTED')<void>(),
    terminated: createStandardAction('app/TERMINATED')<void>(),

    log:createStandardAction('app/LOG')<LogMessage>(),

    sagaError:createStandardAction('app/SAGA_ERROR')<{}>()
    
}

export type AppActions = ActionType<typeof AppActions>;

