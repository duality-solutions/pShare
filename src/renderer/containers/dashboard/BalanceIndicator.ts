import { RendererRootState } from "../../reducers";
import { BalanceIndicator, BalanceIndicatorDispatchProps, BalanceIndicatorStateProps } from "../../components/dashboard/BalanceIndicator"
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { connect } from "react-redux";
import { BdapActions } from "../../../shared/actions/bdap";

const mapStateToProps = (state: RendererRootState, ownProps: { hideLinkWhenMinimized?: boolean }): BalanceIndicatorStateProps => ({
    balance: state.bdap.balance,
    walletAddress: state.bdap.topUpAddress || "",
    errorMessage: state.bdap.insufficientFundsErrorMessage,
    ...ownProps
})

const mapDispatchToProps: MapPropsToDispatchObj<BalanceIndicatorDispatchProps> = { ...BdapActions };

export default connect(mapStateToProps, mapDispatchToProps)(BalanceIndicator)

