import { RendererRootState } from "../../reducers";
import { MyLinksStateProps, MyLinksDispatchProps, MyLinks } from "../../components/dashboard/MyLinks";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { connect } from "react-redux";
import { createSelector } from 'reselect'
import { blinq } from "blinq";
import { BdapUser } from "../../system/BdapUser";
import { push } from "connected-react-router";
import { filterDeniedUsers } from "./helpers/filterDeniedUsers";
import { DashboardActions } from "../../../shared/actions/dashboard";
import { FileSharingActions } from "../../../shared/actions/fileSharing";
import { SearchActions } from "../../../shared/actions/search";

const getUserName = createSelector([(state: RendererRootState) => typeof state.bdap.currentUser !== 'undefined' ? state.bdap.currentUser.object_id : undefined], (user) => user)
const getUserList = createSelector(
    [
        (state: RendererRootState) => state.myLinksSearch.query,
        (state: RendererRootState) => state.bdap.users,
        (state: RendererRootState) => state.bdap.completeLinks,
        (state: RendererRootState) => state.bdap.pendingAcceptLinks,
        (state: RendererRootState) => state.bdap.pendingRequestLinks,
        (state: RendererRootState) => state.bdap.deniedLinks,
        (state: RendererRootState) => typeof state.bdap.currentUser !== 'undefined' ? state.bdap.currentUser.object_full_path : undefined
    ],
    (query, users, completeLinks, pendingAcceptLinks, pendingRequestLinks, deniedLinks, currentUserFqdn) => {
        const linkedUsers = blinq(users)
            .join(
                completeLinks,
                u => u.object_full_path,
                l => blinq([l.recipient_fqdn, l.requestor_fqdn]).first(n => n !== currentUserFqdn),
                (u) => ({
                    userName: u.object_id,
                    commonName: u.common_name,
                    state: "linked"
                } as BdapUser))
        const pendingAcceptUsers = filterDeniedUsers(blinq(users), deniedLinks)
            .join(
                pendingAcceptLinks,
                u => u.object_full_path,
                l => blinq([l.recipient_fqdn, l.requestor_fqdn]).first(n => n !== currentUserFqdn),
                (u) => ({
                    userName: u.object_id,
                    commonName: u.common_name,
                    state: "pending"
                } as BdapUser))
        const pendingRequestUsers = blinq(users)
            .join(
                pendingRequestLinks,
                u => u.object_full_path,
                l => blinq([l.recipient_fqdn, l.requestor_fqdn]).first(n => n !== currentUserFqdn),
                (u) => ({
                    userName: u.object_id,
                    commonName: u.common_name,
                    state: "pending"
                } as BdapUser))
        return linkedUsers
            .concat(pendingAcceptUsers)
            .concat(pendingRequestUsers)
            .select(bdapUser => ({ bdapUser, commonNameQueryPosition: bdapUser.commonName.indexOf(query), userNameQueryPosition: bdapUser.userName.indexOf(query) }))
            .where(x => x.commonNameQueryPosition >= 0 || x.userNameQueryPosition >= 0)
            .orderBy(x => blinq([x.commonNameQueryPosition, x.userNameQueryPosition]).where(v => v >= 0).min())
            .thenBy(x => x.bdapUser.commonName.toLowerCase())
            .thenBy(x => x.bdapUser.userName.toLowerCase())
            .select(x => x.bdapUser)
            .toArray()
    }
)

const mapStateToProps = (state: RendererRootState /*, ownProps*/): MyLinksStateProps => {
    return {
        users: getUserList(state),
        userName: getUserName(state)!,
        query: state.myLinksSearch.query
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<MyLinksDispatchProps> = { ...SearchActions, ...FileSharingActions, ...DashboardActions, push };

export default connect(mapStateToProps, mapDispatchToProps)(MyLinks)
