import { connect } from 'react-redux';
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { EnterToken, EnterTokenDispatchProps, EnterTokenStateProps } from '../../components/onboarding/EnterToken';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterTokenStateProps => {
    return {
        token: state.bdapAccountFormValues.fields.token.value,
        isValidating: state.bdapAccountFormValues.fields.token.isValidating,
        validationResult: state.bdapAccountFormValues.fields.token.validationResult
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<EnterTokenDispatchProps> = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(EnterToken)