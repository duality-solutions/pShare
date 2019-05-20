import { connect } from 'react-redux';
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { SecureFilePassword, SecureFilePasswordDispatchProps, SecureFilePasswordStateProps } from '../../components/onboarding_restore/SecureFilePassword';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): SecureFilePasswordStateProps => {
    return {

        error: state.mnemonicFileRestore.error
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<SecureFilePasswordDispatchProps> = { ...OnboardingActions };


export default connect(mapStateToProps, mapDispatchToProps)(SecureFilePassword)