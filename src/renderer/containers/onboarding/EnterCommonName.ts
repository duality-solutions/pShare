import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { EnterCommonName, EnterCommonNameDispatchProps, EnterCommonNameStateProps } from '../../components/onboarding/EnterCommonName';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterCommonNameStateProps => {
    return {
        commonName: state.onboarding.fields.commonName.value,
        isValidating: state.onboarding.fields.commonName.isValidating,
        validationResult: state.onboarding.fields.commonName.validationResult
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<EnterCommonNameDispatchProps> = { ...OnboardingActions };
// const mapDispatchToProps:EnterCommonNameDispatchProps = { ...OnboardingActions };
export default connect(mapStateToProps, mapDispatchToProps)(EnterCommonName)