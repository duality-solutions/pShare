import { createStandardAction, ActionType } from "typesafe-actions";
import { FilePathInfo } from "../types/FilePathInfo";
import { RequestStatus } from "../../main/sagas/bulkImportSaga";

export const BulkImportActions = {
    previewBulkImport: createStandardAction('bulkImport/PREVIEW_BULK_IMPORT')<FilePathInfo>(),
    previewData: createStandardAction('bulkImport/PREVIEW_DATA')<string>(),
    beginBulkImport: createStandardAction('bulkImport/BEGIN_BULK_IMPORT')<string>(),
    bulkImportAborted: createStandardAction('bulkImport/BULK_IMPORT_ABORTED')<void>(),
    bulkImportProgress: createStandardAction('bulkImport/BULK_IMPORT_PROGRESS')<BulkImportProgress>(),
    bulkImportFailed: createStandardAction('bulkImport/BULK_IMPORT_FAILED')<void>(),
    bulkImportSuccess: createStandardAction('bulkImport/BULK_IMPORT_SUCCESS')<RequestStatus[]>(),
}

export type BulkImportActions = ActionType<typeof BulkImportActions>;

interface BulkImportProgress {
    totalItems: number,
    successful: number,
    failed: number,
    currentItem: {
        linkFqdn: string,
        success: boolean,
        err?: string
    }
}