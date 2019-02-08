import { ActionType, createStandardAction } from 'typesafe-actions';
//import { MainRootState } from '../../main/reducers';

// ensure this is added to ./index.ts RootActions
export const StoreActions = {
    reset: createStandardAction('store/RESET')<void>(),
    hydratePersistedData: createStandardAction('store/HYDRATE')<void>()
}

export type StoreActions = ActionType<typeof StoreActions>;

