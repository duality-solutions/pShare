import { RendererRootState } from "../../reducers";
import { AddLinksStateProps, AddLinks, AddLinksDispatchProps } from "../../components/dashboard/AddLinks";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { BdapActions } from "../../../shared/actions/bdap";
import { connect } from "react-redux";
import { createSelector } from 'reselect'
import { BdapUser } from "../../system/BdapUser";
import { blinq } from "blinq";
import { push } from "connected-react-router";
import { filterDeniedUsers } from "./helpers/filterDeniedUsers";
import { SearchActions } from "../../../shared/actions/search";
import { BulkImportActions } from "../../../shared/actions/bulkImport";



const getCurrentUserName = createSelector((state: RendererRootState) => state.bdap.currentUser, currentUser => {
    if (typeof currentUser === 'undefined') {
        throw Error("state.bdap.currentUser is unexpectedly undefined")
    }
    return currentUser.object_id
})
const getUserList = createSelector(
    [
        (state: RendererRootState) => state.addLinksSearch.query,

        (state: RendererRootState) => state.bdap.users,
        (state: RendererRootState) => state.bdap.pendingRequestLinks,
        (state: RendererRootState) => state.bdap.pendingAcceptLinks,
        (state: RendererRootState) => state.bdap.completeLinks,
        (state: RendererRootState) => state.bdap.deniedLinks,
        (state: RendererRootState) => typeof state.bdap.currentUser !== 'undefined' ? state.bdap.currentUser.object_full_path : undefined

    ],
    (query, users, pendingRequestLinks, pendingAcceptLinks, completeLinks, deniedLinks, currentFqUser) => {
        //const allLinks = blinq(pendingRequestLinks).concat(pendingAcceptLinks)
        const existingLinks = completeLinks.concat(pendingAcceptLinks)
        const baseQuery = filterDeniedUsers(blinq(users), deniedLinks)
            .where(u => u.object_full_path !== currentFqUser)
            .leftOuterJoin(existingLinks, u => u.object_full_path, c => blinq([c.recipient_fqdn, c.requestor_fqdn]).first(n => n !== currentFqUser), (user, link) => ({ user, link }))
            .where(({ link }) => typeof link === 'undefined')
            .select(({ user }) => user) //all users, minus those for whom we already have a complete/pending accept link
            .leftOuterJoin(pendingRequestLinks, user => user.object_full_path, link => blinq([link.recipient_fqdn, link.requestor_fqdn]).first(n => n !== currentFqUser), (user, link) => ({
                userName: user.object_id,
                commonName: user.common_name,
                state: typeof link === 'undefined' ? "normal" : "pending"
            } as BdapUser));
        const retVal = query.length > 0
            ? baseQuery
                .select(bdapUser => ({ bdapUser, commonNameQueryPosition: bdapUser.commonName.indexOf(query), userNameQueryPosition: bdapUser.userName.indexOf(query) }))
                .where(x => x.commonNameQueryPosition >= 0 || x.userNameQueryPosition >= 0)
                .orderBy(x => blinq([x.commonNameQueryPosition, x.userNameQueryPosition]).where(v => v >= 0).min())
                .thenBy(x => x.bdapUser.commonName.toLowerCase())
                .thenBy(x => x.bdapUser.userName.toLowerCase())
                .select(x => x.bdapUser)
                .toArray()
            : baseQuery
                .orderBy(u => u.commonName)
                .thenBy(u => u.userName)
                .toArray()

        return retVal
    })

const mapStateToProps = (state: RendererRootState /*, ownProps*/): AddLinksStateProps => {
    const currentUserName = getCurrentUserName(state)

    return {
        users: getUserList(state),
        currentUserName,
        queryText: state.addLinksSearch.queryText,
        status: state.addLinksSearch.query.length < 3 ? "NO_SEARCH" : "SEARCH_RESULT"
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<AddLinksDispatchProps> = { ...SearchActions, ...BdapActions, ...BulkImportActions, push };

export default connect(mapStateToProps, mapDispatchToProps)(AddLinks)
