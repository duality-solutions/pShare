import { RendererRootState } from "../../reducers";
import { AddLinksStateProps, AddLinksDispatchProps, AddLinks } from "../../components/dashboard/AddLinks";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { BdapActions } from "../../../shared/actions/bdap";
import { connect } from "react-redux";
import { createSelector } from 'reselect'
import { BdapUser } from "../../system/BdapUser";




const getUserList = createSelector((state: RendererRootState) => state.bdap.users, u => u.map<BdapUser>(uu => ({ userName: uu.object_id, commonName: uu.common_name, state: "normal" })))

const mapStateToProps = (state: RendererRootState /*, ownProps*/): AddLinksStateProps => {
    return {
        users: getUserList(state)
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<AddLinksDispatchProps> = { ...BdapActions };

export default connect(mapStateToProps, mapDispatchToProps)(AddLinks)
