import { connect } from 'react-redux'
import OnboardingActions from "../../shared/actions/onboarding";
import { RendererRootState } from '../reducers'
import { CreateAccount, CreateAccountDispatchProps, CreateAccountStateProps } from '../components/CreateAccount';
import { MapPropsToDispatchObj } from '../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): CreateAccountStateProps => {
    return {
        
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<CreateAccountDispatchProps> = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount)