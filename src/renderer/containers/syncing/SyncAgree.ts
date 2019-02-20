import { connect } from 'react-redux';
import { UserActions } from "../../../shared/actions/user";
import { SyncAgree, SyncAgreeDispatchProps, SyncAgreeStateProps } from '../../components/syncing/SyncAgree';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): SyncAgreeStateProps => {
    return {

    };
};


const mapDispatchToProps: MapPropsToDispatchObj<SyncAgreeDispatchProps> = { ...UserActions };

export default connect(mapStateToProps, mapDispatchToProps)(SyncAgree)