import { RendererRootState } from "../../../renderer/reducers";
import {  DashboardStateProps, Dashboard as Dashboard_  } from "../../../renderer/components/dashboard/index";
// import { MapPropsToDispatchObj } from "../../../renderer/system/MapPropsToDispatchObj";
// import { push } from "connected-react-router";
import { connect } from "react-redux";

const mapStateToProps = (state: RendererRootState /*, ownProps*/): DashboardStateProps => {
    return {
        spinner: state.applicationState.spinner
    };
};

// const mapDispatchToProps: MapPropsToDispatchObj<SidebarDispatchProps> = { push };

export default connect(mapStateToProps)(Dashboard_)
// , mapDispatchToProps)(Sidebar_)