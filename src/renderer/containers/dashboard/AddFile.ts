import { RendererRootState } from "../../reducers";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { connect } from "react-redux";
import { AddFileStateProps, AddFilesDispatchProps, AddFile } from "../../components/dashboard/AddFile";
import { AddFileActions } from "../../../shared/actions/addFile";




const mapStateToProps = (state: RendererRootState /*, ownProps*/): AddFileStateProps => {
    return {

    };
};

const mapDispatchToProps: MapPropsToDispatchObj<AddFilesDispatchProps> = { ...AddFileActions };

export default connect(mapStateToProps, mapDispatchToProps)(AddFile)
