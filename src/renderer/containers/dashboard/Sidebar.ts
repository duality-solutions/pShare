import { RendererRootState } from "../../../renderer/reducers";
import { SidebarDispatchProps, SidebarStateProps, Sidebar as Sidebar_ } from "../../../renderer/components/dashboard/Sidebar";
import { MapPropsToDispatchObj } from "../../../renderer/system/MapPropsToDispatchObj";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { DashboardActions } from "../../../shared/actions/dashboard";

const mapStateToProps = (state: RendererRootState /*, ownProps*/): SidebarStateProps => {
    return {
        location: state.router.location.pathname
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<SidebarDispatchProps> = { push, ...DashboardActions };

export const Sidebar = connect(mapStateToProps, mapDispatchToProps)(Sidebar_)