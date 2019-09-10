import { createStandardAction, ActionType } from "typesafe-actions";

export const BulkImportActions = {

    beginBulkImport: createStandardAction('bulkImport/BEGIN_BULK_IMPORT')<void>(),
    bulkImportAborted: createStandardAction('bulkImport/BULK_IMPORT_ABORTED')<void>(),
    bulkImportProgress: createStandardAction('bulkImport/BULK_IMPORT_PROGRESS')<BulkImportProgress>(),
    bulkImportFailed: createStandardAction('bulkImport/BULK_IMPORT_FAILED')<void>(),
    bulkImportSuccess: createStandardAction('bulkImport/BULK_IMPORT_SUCCESS')<void>(),
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