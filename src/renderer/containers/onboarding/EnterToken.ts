import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { EnterToken, EnterTokenDispatchProps, EnterTokenStateProps } from '../../components/onboarding/EnterToken';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterTokenStateProps => {
    return {
        token: state.onboarding.fields.token.value,
        isValidating: state.onboarding.fields.token.isValidating,
        validationResult: state.onboarding.fields.token.validationResult
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<EnterTokenDispatchProps> = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(EnterToken)