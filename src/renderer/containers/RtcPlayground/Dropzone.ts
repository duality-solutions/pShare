import { RendererRootState } from "../../reducers";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { connect } from "react-redux";
import { DropzoneStateProps, DropzoneDispatchProps, Dropzone as _Dropzone } from "../../../renderer/components/RtcPlayground/Dropzone";
import { FileActions } from "../../../shared/actions/file";

const mapStateToProps = (state: RendererRootState /*, ownProps*/): DropzoneStateProps => ({});

const mapDispatchToProps: MapPropsToDispatchObj<DropzoneDispatchProps> = { ...FileActions };

export const Dropzone = connect(mapStateToProps, mapDispatchToProps)(_Dropzone)
