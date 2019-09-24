import { BulkImportActions } from '../actions/bulkImport';
import { getType } from 'typesafe-actions';

export interface BulkImportPreviewState {
    previewData: string,
    // bulkImportSuccess: boolean
}

const initialState: BulkImportPreviewState = {
    previewData: '',
    // bulkImportSuccess: false
}

export const bulkImport = (state = initialState, action: BulkImportActions): BulkImportPreviewState => {
    switch (action.type) {
        case getType(BulkImportActions.previewData):
            return { ...state, previewData: action.payload }
        // case getType(BulkImportActions.bulkImportSuccess):
        //     return { ...state, bulkImportSuccess: true}
        default:
            return state
    }
};
