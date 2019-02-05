import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { EnterUserName, EnterUserNameDispatchProps, EnterUserNameStateProps } from '../../components/onboarding/EnterUserName';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterUserNameStateProps => {
   
    return {
        userName:state.onboarding.userName.value,
        isValidating:state.onboarding.userName.isValidating,
        validationResult:state.onboarding.userName.validationResult
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<EnterUserNameDispatchProps> = { ...OnboardingActions };
// const mapDispatchToProps:EnterUserNameDispatchProps = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(EnterUserName)