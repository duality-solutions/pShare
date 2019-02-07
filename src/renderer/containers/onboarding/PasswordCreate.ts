import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { PasswordCreate, PasswordCreateDispatchProps, PasswordCreateStateProps } from '../../components/onboarding/PasswordCreate';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): PasswordCreateStateProps => {
   
    return {
        password:state.bdapAccountFormValues.fields.userName.value,
        // isValidating:state.bdapAccountFormValues.fields.userName.isValidating,
        // validationResult:state.bdapAccountFormValues.fields.userName.validationResult
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<PasswordCreateDispatchProps> = { ...OnboardingActions };
// const mapDispatchToProps:EnterUserNameDispatchProps = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(PasswordCreate)