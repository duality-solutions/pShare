import { connect } from 'react-redux';
import OnboardingActions from "../../shared/actions/onboarding";
import { EnterDisplayName, EnterDisplaynameDispatchProps, EnterDisplaynameStateProps } from '../components/EnterDisplayName';
import { RendererRootState } from '../reducers';
import { MapPropsToDispatchObj } from '../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterDisplaynameStateProps => {
    return {
        
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<EnterDisplaynameDispatchProps> = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(EnterDisplayName)