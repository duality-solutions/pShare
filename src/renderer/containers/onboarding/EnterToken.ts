import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { EnterToken, EnterTokenDispatchProps, EnterTokenStateProps } from '../../components/onboarding/EnterToken';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterTokenStateProps => {
    return {
        token: state.onboarding.token.value,
        isValidating: state.onboarding.token.isValidating,
        validationResult: state.onboarding.token.validationResult
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<EnterTokenDispatchProps> = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(EnterToken)