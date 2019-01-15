import { connect } from 'react-redux'
import UserActions from "../../shared/actions/user";
import { RendererRootState } from '../reducers'
import { SyncAgree, SyncAgreeDispatchProps, SyncAgreeStateProps } from '../components/SyncAgree';
import { MapPropsToDispatchObj } from '../../shared/system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): SyncAgreeStateProps => {
    return {
        
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<SyncAgreeDispatchProps> = { ...UserActions };

export default connect(mapStateToProps, mapDispatchToProps)(SyncAgree)