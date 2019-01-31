import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { EnterDisplayname, EnterDisplaynameDispatchProps, EnterDisplaynameStateProps } from '../../components/onboarding/EnterDisplayname';
import { RendererRootState } from '../../reducers';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterDisplaynameStateProps => {
    return {
        displayname: state.onboarding.displayname
    };
};


// const mapDispatchToProps: MapPropsToDispatchObj<EnterDisplaynameDispatchProps> = { ...OnboardingActions };
const mapDispatchToProps:EnterDisplaynameDispatchProps = { ...OnboardingActions };
export default connect(mapStateToProps, mapDispatchToProps)(EnterDisplayname)