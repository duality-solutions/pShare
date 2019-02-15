import { connect } from 'react-redux';
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { SecureMnemonicFile, SecureMnemonicFileDispatchProps, SecureMnemonicFileStateProps } from '../../components/onboarding/SecureMnemonicFile';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): SecureMnemonicFileStateProps => ({
    mnemonicFilePassword: state.secureMnemonicFileFormValues.fields.mnemonicFilePassword.value,
    isValidating: state.secureMnemonicFileFormValues.fields.mnemonicFilePassword.isValidating,
    validationResult: state.secureMnemonicFileFormValues.fields.mnemonicFilePassword.validationResult
});


const mapDispatchToProps: MapPropsToDispatchObj<SecureMnemonicFileDispatchProps> = { ...OnboardingActions };
// const mapDispatchToProps:EnterUserNameDispatchProps = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(SecureMnemonicFile)