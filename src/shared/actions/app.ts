import { ActionType, createStandardAction } from 'typesafe-actions';

// ensure this is added to ./index.ts RootActions
export const AppActions = {
    initializeApp: createStandardAction('app/INITIALIZE')<void>(),
    appInitialized: createStandardAction('app/INITIALIZED')<void>(),
}

export type AppActions = ActionType<typeof AppActions>;

