import { connect } from 'react-redux';
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { RestoreWithMnemonicFile, RestoreWithMnemonicFileDispatchProps, RestoreWithMnemonicFileStateProps } from '../../components/onboarding_restore/RestoreWithMnemonicFile';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): RestoreWithMnemonicFileStateProps => {
    return {
        
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<RestoreWithMnemonicFileDispatchProps> = { ...OnboardingActions };


export default connect(mapStateToProps, mapDispatchToProps)(RestoreWithMnemonicFile)