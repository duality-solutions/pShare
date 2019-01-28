import { connect } from 'react-redux';
import OnboardingActions from "../../shared/actions/onboarding";
import { EnterUsername, EnterUsernameDispatchProps, EnterUsernameStateProps } from '../components/EnterUsername';
import { RendererRootState } from '../reducers';
import { MapPropsToDispatchObj } from '../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterUsernameStateProps => {
    return {
        
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<EnterUsernameDispatchProps> = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(EnterUsername)