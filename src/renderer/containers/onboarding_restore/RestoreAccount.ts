import { connect } from 'react-redux';
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { RestoreAccount, RestoreAccountDispatchProps, RestoreAccountStateProps } from '../../components/onboarding_restore/RestoreAccount';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): RestoreAccountStateProps => {
    return {
        
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<RestoreAccountDispatchProps> = { ...OnboardingActions };


export default connect(mapStateToProps, mapDispatchToProps)(RestoreAccount)