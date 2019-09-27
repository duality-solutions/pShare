import { BulkImportActions } from '../actions/bulkImport';
import { getType } from 'typesafe-actions';
import { RequestStatus } from '../../main/sagas/bulkImportSaga';

export interface BulkImportPreviewState {
    previewData: string,
    err: boolean,
    fqdnData: RequestStatus[]
}

const initialState: BulkImportPreviewState = {
    previewData: '',
    fqdnData: [],
    err: false
}

export const bulkImport = (state = initialState, action: BulkImportActions): BulkImportPreviewState => {
    switch (action.type) {
        case getType(BulkImportActions.previewData):
            return { ...state, previewData: action.payload }
        case getType(BulkImportActions.bulkImportSuccess):
            return {...state, fqdnData: [...action.payload] }
            case getType(BulkImportActions.bulkImportFailed):
                return {...state, fqdnData: [...action.payload], err: true }
            default:
            return state
    }
};
