import { connect } from 'react-redux';
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { MnemonicWarning, MnemonicWarningDispatchProps, MnemonicWarningStateProps } from '../../components/onboarding/MnemonicWarning';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): MnemonicWarningStateProps => {
    return {
    };
};


const mapDispatchToProps: MapPropsToDispatchObj<MnemonicWarningDispatchProps> = { ...OnboardingActions };
// const mapDispatchToProps:MnemonicWarningDispatchProps = { ...OnboardingActions };
export default connect(mapStateToProps, mapDispatchToProps)(MnemonicWarning) 