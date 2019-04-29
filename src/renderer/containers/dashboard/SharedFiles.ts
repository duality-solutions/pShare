import { RendererRootState } from "../../reducers";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { connect } from "react-redux";
import { SharedFiles, SharedFilesStateProps, SharedFilesDispatchProps } from "../../components/dashboard/SharedFiles";
import { SharedFilesActions } from "../../../shared/actions/sharedFiles";




const mapStateToProps = (state: RendererRootState /*, ownProps*/): SharedFilesStateProps => {
    return {

    };
};

const mapDispatchToProps: MapPropsToDispatchObj<SharedFilesDispatchProps> = { ...SharedFilesActions };

export default connect(mapStateToProps, mapDispatchToProps)(SharedFiles)
