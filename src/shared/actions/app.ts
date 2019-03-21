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
    shutdown: createStandardAction('app/SHUTDOWN')<void>(),

    sleep:createStandardAction('app/SLEEP')<void>(),
    wake:createStandardAction('app/WAKE')<void>(),
    getRpcClientUnsuccessful:createStandardAction('app/GET_RPC_CLIENT_UNSUCCESSFUL')<string|void>(),

    log:createStandardAction('app/LOG')<LogMessage>()
    
}

export type AppActions = ActionType<typeof AppActions>;

