import { ActionType, createStandardAction } from 'typesafe-actions';


const StoreActions = {
    reset: createStandardAction('@@store/RESET')<void>()
}

type StoreActions = ActionType<typeof StoreActions>;

export default StoreActions