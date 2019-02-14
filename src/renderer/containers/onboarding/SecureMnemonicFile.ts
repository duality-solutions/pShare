import { connect } from 'react-redux';
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { SecureMnemonicFile, SecureMnemonicFileDispatchProps, SecureMnemonicFileStateProps } from '../../components/onboarding/SecureMnemonicFile';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): SecureMnemonicFileStateProps => ({
    password: state.secureMnemonicFileFormValues.fields.password.value,
    isValidating: state.secureMnemonicFileFormValues.fields.password.isValidating,
    validationResult: state.secureMnemonicFileFormValues.fields.password.validationResult
});


const mapDispatchToProps: MapPropsToDispatchObj<SecureMnemonicFileDispatchProps> = { ...OnboardingActions };
// const mapDispatchToProps:EnterUserNameDispatchProps = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(SecureMnemonicFile)