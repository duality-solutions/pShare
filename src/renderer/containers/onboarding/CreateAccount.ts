import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { CreateAccount, CreateAccountDispatchProps, CreateAccountStateProps } from '../../components/onboarding/CreateAccount';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): CreateAccountStateProps => {
    return {
        
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<CreateAccountDispatchProps> = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount)