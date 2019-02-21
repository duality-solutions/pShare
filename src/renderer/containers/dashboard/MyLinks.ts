import { RendererRootState } from "../../reducers";
import { MyLinksStateProps, MyLinksDispatchProps, MyLinks } from "../../components/dashboard/MyLinks";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { BdapActions } from "../../../shared/actions/bdap";
import { connect } from "react-redux";
import { createSelector } from 'reselect'
import { blinq } from "blinq";
import { BdapUser } from "../../system/BdapUser";


const getUserList = createSelector(
    (state: RendererRootState) => state.bdap.users,
    u => blinq(u)
        .select(x => ({ userName: x.object_id, commonName: x.common_name, state: "normal" }) as BdapUser)
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
