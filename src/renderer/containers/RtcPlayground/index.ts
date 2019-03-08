import { RendererRootState } from "../../reducers";
import { RtcPlaygroundStateProps, RtcPlaygroundDispatchProps, RtcPlayground as _RtcPlayground } from "../../components/RtcPlayground";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { RtcActions } from "../../../shared/actions/rtc";

const mapStateToProps = (state: RendererRootState /*, ownProps*/): RtcPlaygroundStateProps => {
    return {
        text: state.rtcPlayground.text
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<RtcPlaygroundDispatchProps> = { push, ...RtcActions };

export const RtcPlayground = connect(mapStateToProps, mapDispatchToProps)(_RtcPlayground)
