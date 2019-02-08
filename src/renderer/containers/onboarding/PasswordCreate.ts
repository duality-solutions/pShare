import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { PasswordCreate, PasswordCreateDispatchProps, PasswordCreateStateProps } from '../../components/onboarding/PasswordCreate';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): PasswordCreateStateProps => ({
    password: state.passwordCreateFormValues.fields.password.value,
    isValidating: state.passwordCreateFormValues.fields.password.isValidating,
    validationResult: state.passwordCreateFormValues.fields.password.validationResult
});


const mapDispatchToProps: MapPropsToDispatchObj<PasswordCreateDispatchProps> = { ...OnboardingActions };
// const mapDispatchToProps:EnterUserNameDispatchProps = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(PasswordCreate)