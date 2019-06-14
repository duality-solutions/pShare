import { connect } from 'react-redux';
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { PasswordCreateOrLogin, PasswordCreateDispatchProps, PasswordCreateStateProps } from '../../components/onboarding/PasswordCreateOrLogin';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): PasswordCreateStateProps => ({
    password: state.passwordCreateFormValues.fields.password.value,
    isValidating: state.passwordCreateFormValues.fields.password.isValidating,
    validationResult: state.passwordCreateFormValues.fields.password.validationResult,
    uiType: state.user.walletEncrypted ? "LOGIN" : "CREATE"
});


const mapDispatchToProps: MapPropsToDispatchObj<PasswordCreateDispatchProps> = { ...OnboardingActions };
// const mapDispatchToProps:EnterUserNameDispatchProps = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(PasswordCreateOrLogin)