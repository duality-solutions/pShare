import { connect } from 'react-redux';
import { RestoreSyncProgress, RestoreSyncProgressDispatchProps, RestoreSyncProgressStateProps } from '../../components/onboarding_restore/RestoreSyncProgress';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): RestoreSyncProgressStateProps => {
    return {
        isComplete:state.sync.isComplete,
        progressPercent:state.sync.progressPercent,
        RestoreSyncProgressStarted:state.sync.syncStarted
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<RestoreSyncProgressDispatchProps> = { };

export default connect(mapStateToProps, mapDispatchToProps)(RestoreSyncProgress)