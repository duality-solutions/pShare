import { RendererRootState } from "../../reducers";
import { MyListStateProps, MyListDispatchProps, MyList as MyList_ } from "../../components/main/MyList";
import { MapPropsToDispatchObj } from "../../../renderer/system/MapPropsToDispatchObj";
import { BdapActions } from "../../../shared/actions/bdap";
import { connect } from "react-redux";

const mapStateToProps = (state: RendererRootState /*, ownProps*/): MyListStateProps => {
    return {
        users : state.bdap.users
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<MyListDispatchProps> = { ...BdapActions };

export const MyList = connect(mapStateToProps, mapDispatchToProps)(MyList_)
