import { ActionType, createStandardAction } from 'typesafe-actions';


const StoreActions = {
    reset: createStandardAction('store/RESET')<void>()
}

type StoreActions = ActionType<typeof StoreActions>;

// ensure this is added to ./index.ts RootActions
export default StoreActions