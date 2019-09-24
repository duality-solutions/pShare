import { BulkImportActions } from '../actions/bulkImport';
import { getType } from 'typesafe-actions';

export interface BulkImportPreviewState {
    previewData: string
}

export const bulkImport = (state: BulkImportPreviewState = { previewData: ''}, action: BulkImportActions): BulkImportPreviewState => {
    switch (action.type) {
        case getType(BulkImportActions.previewData):
            return { ...state, previewData: action.payload }
        default:
            return state
    }
};
