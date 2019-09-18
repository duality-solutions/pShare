import { RendererRootState } from "../../reducers";
import { BalanceIndicator, BalanceIndicatorDispatchProps, BalanceIndicatorStateProps } from "../../components/dashboard/BalanceIndicator"
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { connect } from "react-redux";

const mapStateToProps = (state: RendererRootState /*, ownProps*/): BalanceIndicatorStateProps => ({
    balance: state.bdap.balance,
    walletAddress: state.bdap.topUpAddress || ""
})

const mapDispatchToProps: MapPropsToDispatchObj<BalanceIndicatorDispatchProps> = {};

export default connect(mapStateToProps, mapDispatchToProps)(BalanceIndicator)

