import { BulkImportActions } from '../actions/bulkImport';
import { getType } from 'typesafe-actions';
import { RequestStatus } from '../../main/sagas/bulkImportSaga';

export interface BulkImportPreviewState {
    previewData: string,
    fqdnData: RequestStatus[]
}

const initialState: BulkImportPreviewState = {
    previewData: '',
    fqdnData: []
}

export const bulkImport = (state = initialState, action: BulkImportActions): BulkImportPreviewState => {
    switch (action.type) {
        case getType(BulkImportActions.previewData):
            return { ...state, previewData: action.payload }
        case getType(BulkImportActions.bulkImportSuccess):
            return {...state, fqdnData: [...action.payload] }
        default:
            return state
    }
};
