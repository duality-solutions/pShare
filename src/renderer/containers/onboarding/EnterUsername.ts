import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { EnterUsername, EnterUsernameDispatchProps, EnterUsernameStateProps } from '../../components/onboarding/EnterUsername';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterUsernameStateProps => {
   
    return {
        username:state.onboarding.username.value,
        isValidating:state.onboarding.username.isValidating,
        validationResult:state.onboarding.username.validationResult
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<EnterUsernameDispatchProps> = { ...OnboardingActions };
// const mapDispatchToProps:EnterUsernameDispatchProps = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(EnterUsername)