import { RendererRootState } from "../../reducers";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { connect } from "react-redux";
import { BulkImportStateProps, BulkImportsDispatchProps, BulkImport } from "../../components/dashboard/BulkImport";
import { BulkImportActions } from "../../../shared/actions/bulkImport";
import { push } from "connected-react-router";




const mapStateToProps = (state: RendererRootState /*, ownProps*/): BulkImportStateProps => {
    return {
        data: state.bulkImport.previewData,
        fqdnData: state.bulkImport.fqdnData
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<BulkImportsDispatchProps> = { ...BulkImportActions, push };

export default connect(mapStateToProps, mapDispatchToProps)(BulkImport)
