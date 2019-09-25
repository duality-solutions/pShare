import { ActionType, createStandardAction } from 'typesafe-actions';
// import { PublicSharedFile } from '../types/PublicSharedFile';
// import { FileListMessage } from '../types/FileListMessage';

interface BaseNavigationCommand {
    type: "sharedFiles" | "downloadableFiles",
}
interface NavigationCommand extends BaseNavigationCommand {
    location: string
}

export const FileNavigationActions = {
    openDirectory: createStandardAction('file_navigation/OPEN_DIRECTORY')<NavigationCommand>(),
    upDirectory: createStandardAction('file_navigation/UP_DIRECTORY')<BaseNavigationCommand>(),
    goRoot: createStandardAction('file_navigation/GO_ROOT')<BaseNavigationCommand>(),
};
export type FileNavigationActions = ActionType<typeof FileNavigationActions>;
