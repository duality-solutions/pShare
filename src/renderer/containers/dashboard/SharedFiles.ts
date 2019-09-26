import { RendererRootState } from "../../reducers";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { connect } from "react-redux";
import { SharedFiles, SharedFilesStateProps, SharedFilesDispatchProps } from "../../components/dashboard/SharedFiles";
import { SharedFilesActions } from "../../../shared/actions/sharedFiles";
import { FileSharingActions } from "../../../shared/actions/fileSharing";
import { RemoveFileActions } from "../../../shared/actions/removeFile";

import { createSelector } from 'reselect'
import { fileListToTree } from "../../../shared/system/file/fileListToTree";
import { getDirectoryListing } from "../../../shared/system/file/getDirectoryListing";
import { FileNavigationActions } from "../../../shared/actions/fileNavigation";

const userNameSelector = (state: RendererRootState) => state.sharedFiles.linkedUserName
const fileWatchUsersSelector = (state: RendererRootState) => state.fileWatch.users;
const fileWatchUserSelector = createSelector(
    [
        userNameSelector,
        fileWatchUsersSelector
    ],
    (linkedUserName, users) => linkedUserName != null ? users[linkedUserName] : undefined
)
const outSelector = createSelector(
    [
        fileWatchUserSelector,
    ],
    fileWatchUser => fileWatchUser ? fileWatchUser.out : undefined)
const outFilesSelector = createSelector(
    [
        outSelector
    ],
    out => out ? Object.values(out) : [])
const sharedFilesDownloadableFilesSelector = (state: RendererRootState) => state.sharedFiles.downloadableFiles;

const downloadableFilesSelector = createSelector(
    [
        sharedFilesDownloadableFilesSelector
    ],
    downloadableFiles => downloadableFiles || []
)

const outFilesTreeSelector = createSelector([
    outFilesSelector
], files => fileListToTree(files))

const downloadableFilesTreeSelector = createSelector([
    downloadableFilesSelector
], files => fileListToTree(files))

const sharedFilesPathSelector = (state: RendererRootState) => state.fileNavigation.sharedFilesViewPath.join("/")
const downloadableFilesPathSelector = (state: RendererRootState) => state.fileNavigation.downloadableFilesViewPath.join("/")

const outFilesCurrentDirectorySelector = createSelector(
    [
        outFilesTreeSelector,
        sharedFilesPathSelector
    ],
    (tree, path) => getDirectoryListing(path, tree))

const downloadableFilesCurrentDirectorySelector = createSelector(
    [
        downloadableFilesTreeSelector,
        downloadableFilesPathSelector
    ],
    (tree, path) => getDirectoryListing(path, tree))

const mapStateToProps = (state: RendererRootState /*, ownProps*/): SharedFilesStateProps => {
    //const outFiles = outFilesSelector(state);
    const downloadableFiles = downloadableFilesSelector(state);
    const outFilesView = outFilesCurrentDirectorySelector(state)
    const downloadableFilesView = downloadableFilesCurrentDirectorySelector(state);
    const currentSharedFilesPath = sharedFilesPathSelector(state);
    const currentDownloadableFilesPath = downloadableFilesPathSelector(state);
    return {
        outFilesView,
        downloadableFilesView,
        currentSharedFilesPath,
        currentDownloadableFilesPath,
        linkedUserCommonName: state.sharedFiles.linkedCommonName,
        linkedUserName: state.sharedFiles.linkedUserName,
        userName: state.user.userName!,
        downloadableFiles,
        sharedFilesFetchState: state.sharedFiles.state
    }
};

const mapDispatchToProps: MapPropsToDispatchObj<SharedFilesDispatchProps> = { ...FileNavigationActions, ...SharedFilesActions, ...FileSharingActions, ...RemoveFileActions };

export default connect(mapStateToProps, mapDispatchToProps)(SharedFiles)
