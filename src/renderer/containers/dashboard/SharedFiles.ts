import { RendererRootState } from "../../reducers";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { connect } from "react-redux";
import { SharedFiles, SharedFilesStateProps, SharedFilesDispatchProps } from "../../components/dashboard/SharedFiles";
import { SharedFilesActions } from "../../../shared/actions/sharedFiles";
import { FileSharingActions } from "../../../shared/actions/fileSharing";




const mapStateToProps = (state: RendererRootState /*, ownProps*/): SharedFilesStateProps => {
    return {
        outFiles:
            state.sharedFiles.linkedUserName
                && state.fileWatch.users[state.sharedFiles.linkedUserName]
                && state.fileWatch.users[state.sharedFiles.linkedUserName].out
                ? Object.values(state.fileWatch.users[state.sharedFiles.linkedUserName].out)
                : [],
        linkedUserCommonName: state.sharedFiles.linkedCommonName,
        linkedUserName: state.sharedFiles.linkedUserName,
        userName: state.user.userName!,
        downloadableFiles: state.sharedFiles.downloadableFiles || [],
        sharedFilesFetchState: state.sharedFiles.state
    }
};

const mapDispatchToProps: MapPropsToDispatchObj<SharedFilesDispatchProps> = { ...SharedFilesActions, ...FileSharingActions };

export default connect(mapStateToProps, mapDispatchToProps)(SharedFiles)
