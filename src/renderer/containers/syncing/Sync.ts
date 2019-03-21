import { connect } from 'react-redux';
import { Sync, SyncDispatchProps, SyncStateProps } from '../../components/syncing/Sync';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): SyncStateProps => {
    return {
        isComplete: state.sync.isComplete,
        progressPercent: state.sync.progressPercent,
        syncStarted: state.sync.syncStarted,
        rpcClientFailed: state.app.rpcClientFailure,
        rpcClientFailureMessage: state.app.rpcClientFailureReason
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<SyncDispatchProps> = {};

export default connect(mapStateToProps, mapDispatchToProps)(Sync)