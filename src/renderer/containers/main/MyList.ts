import { RendererRootState } from "../../reducers";
import { MyListStateProps, MyListDispatchProps, MyList as MyList_ } from "../../components/main/MyList";
import { MapPropsToDispatchObj } from "../../../renderer/system/MapPropsToDispatchObj";
import { BdapActions } from "../../../shared/actions/bdap";
import { connect } from "react-redux";
import { createSelector } from 'reselect'


const getUserList = createSelector((state: RendererRootState) => state.bdap.users, u => u.filter(u => u.state !== "linked"))

const mapStateToProps = (state: RendererRootState /*, ownProps*/): MyListStateProps => {
    return {
        users: getUserList(state)
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<MyListDispatchProps> = { ...BdapActions };

export const MyList = connect(mapStateToProps, mapDispatchToProps)(MyList_)
