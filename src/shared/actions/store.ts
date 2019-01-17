import { ActionType, createStandardAction } from 'typesafe-actions';
//import { MainRootState } from '../../main/reducers';


const StoreActions = {
    reset: createStandardAction('store/RESET')<void>(),
    hydratePersistedData: createStandardAction('store/HYDRATE')<void>()
}

type StoreActions = ActionType<typeof StoreActions>;

// ensure this is added to ./index.ts RootActions
export default StoreActions