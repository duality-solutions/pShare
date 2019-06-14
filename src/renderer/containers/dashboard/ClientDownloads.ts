import { RendererRootState } from "../../../renderer/reducers";
import { ClientDownloadsStateProps, ClientDownloadsDispatchProps,ClientDownloads as ClientDownloads_ } from "../../../renderer/components/dashboard/ClientDownloads";
import { MapPropsToDispatchObj } from "../../../renderer/system/MapPropsToDispatchObj";
import { connect } from "react-redux";

const mapStateToProps = (state: RendererRootState /*, ownProps*/): ClientDownloadsStateProps => {
    return {
        currentSessions: state.clientDownloads.currentSessions
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<ClientDownloadsDispatchProps> = {  };

export const ClientDownloads = connect(mapStateToProps, mapDispatchToProps)(ClientDownloads_)