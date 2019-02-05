import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { EnterCommonName, EnterCommonNameDispatchProps, EnterCommonNameStateProps } from '../../components/onboarding/EnterCommonName';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterCommonNameStateProps => {
    return {
        commonName: state.onboarding.commonName.value,
        isValidating: state.onboarding.commonName.isValidating,
        validationResult: state.onboarding.commonName.validationResult
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<EnterCommonNameDispatchProps> = { ...OnboardingActions };
// const mapDispatchToProps:EnterCommonNameDispatchProps = { ...OnboardingActions };
export default connect(mapStateToProps, mapDispatchToProps)(EnterCommonName)