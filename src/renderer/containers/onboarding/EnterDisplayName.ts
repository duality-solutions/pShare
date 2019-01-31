import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { EnterDisplayName, EnterDisplaynameDispatchProps, EnterDisplaynameStateProps } from '../../components/onboarding/EnterDisplayname';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterDisplaynameStateProps => {
    return {
        displayname: state.onboarding.displayname.value,
        isValidating: state.onboarding.displayname.isValidating,
        validationResult: state.onboarding.displayname.validationResult
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<EnterDisplaynameDispatchProps> = { ...OnboardingActions };
// const mapDispatchToProps:EnterDisplaynameDispatchProps = { ...OnboardingActions };
export default connect(mapStateToProps, mapDispatchToProps)(EnterDisplayName)