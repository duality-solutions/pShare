import { connect } from 'react-redux';
import { OnboardingActions } from "../../../shared/actions/onboarding";
import { MnemonicPage, MnemonicPageDispatchProps, MnemonicPageStateProps } from '../../components/onboarding/MnemonicPage';
import { RendererRootState } from '../../reducers';
import { MapPropsToDispatchObj } from '../../system/MapPropsToDispatchObj';


const mapStateToProps = (state: RendererRootState /*, ownProps*/): MnemonicPageStateProps => ({
    mnemonic:state.user.sessionWalletMnemonic
});


const mapDispatchToProps: MapPropsToDispatchObj<MnemonicPageDispatchProps> = { ...OnboardingActions };
// const mapDispatchToProps:MnemonicPageDispatchProps = { ...OnboardingActions };
export default connect(mapStateToProps, mapDispatchToProps)(MnemonicPage) 