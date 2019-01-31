import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { EnterToken, EnterTokenDispatchProps, EnterTokenStateProps } from '../../components/onboarding/EnterToken';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterTokenStateProps => {
    return {
        
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<EnterTokenDispatchProps> = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(EnterToken)