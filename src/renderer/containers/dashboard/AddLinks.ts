import { RendererRootState } from "../../reducers";
import { AddLinksStateProps, AddLinksDispatchProps, AddLinks } from "../../components/dashboard/AddLinks";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { BdapActions } from "../../../shared/actions/bdap";
import { connect } from "react-redux";
import { createSelector } from 'reselect'


const getUserList = createSelector((state: RendererRootState) => state.bdap.users, u => u.filter(u => u.state !== "linked"))

const mapStateToProps = (state: RendererRootState /*, ownProps*/): AddLinksStateProps => {
    return {
        users: getUserList(state)
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<AddLinksDispatchProps> = { ...BdapActions };

export default connect(mapStateToProps, mapDispatchToProps)(AddLinks)
