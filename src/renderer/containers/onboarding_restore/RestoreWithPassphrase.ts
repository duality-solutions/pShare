import { connect } from 'react-redux';
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { RestoreWithPassphrase, RestoreWithPassphraseDispatchProps, RestoreWithPassphraseStateProps } from '../../components/onboarding_restore/RestoreWithPassphrase';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): RestoreWithPassphraseStateProps => {
    return {
        
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<RestoreWithPassphraseDispatchProps> = { ...OnboardingActions };


export default connect(mapStateToProps, mapDispatchToProps)(RestoreWithPassphrase)