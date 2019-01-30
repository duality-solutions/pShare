import { connect } from 'react-redux';
import OnboardingActions from "../../../shared/actions/onboarding";
import { EnterPhoneNumber, EnterPhoneNumberDispatchProps, EnterPhoneNumberStateProps } from '../../components/onboarding/EnterPhoneNumber';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): EnterPhoneNumberStateProps => {
    return {
        
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<EnterPhoneNumberDispatchProps> = { ...OnboardingActions };

export default connect(mapStateToProps, mapDispatchToProps)(EnterPhoneNumber)