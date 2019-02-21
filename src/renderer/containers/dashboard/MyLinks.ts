import { RendererRootState } from "../../reducers";
import { MyLinksStateProps, MyLinksDispatchProps, MyLinks } from "../../components/dashboard/MyLinks";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { BdapActions } from "../../../shared/actions/bdap";
import { connect } from "react-redux";
import { createSelector } from 'reselect'
import { blinq } from "blinq";


const getUserList = createSelector(
    (state: RendererRootState) => state.bdap.users,
    u => blinq(u)
        .where(u => u.state !== "normal")
        .orderBy(u => u.commonName)
        .thenBy(u => u.userName)
        .toArray()
)

const mapStateToProps = (state: RendererRootState /*, ownProps*/): MyLinksStateProps => {
    return {
        users: getUserList(state)
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<MyLinksDispatchProps> = { ...BdapActions };

export default connect(mapStateToProps, mapDispatchToProps)(MyLinks)
