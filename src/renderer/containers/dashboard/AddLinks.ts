import { RendererRootState } from "../../reducers";
import { AddLinksStateProps, AddLinksDispatchProps, AddLinks } from "../../components/dashboard/AddLinks";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { BdapActions } from "../../../shared/actions/bdap";
import { connect } from "react-redux";
import { createSelector } from 'reselect'
import { BdapUser } from "../../system/BdapUser";
import { blinq } from "blinq";
import { push } from "connected-react-router";



const getCurrentUserName = createSelector((state: RendererRootState) => state.bdap.currentUser, currentUser => {
    if (typeof currentUser === 'undefined') {
        throw Error("state.bdap.currentUser is unexpectedly undefined")
    }
    return currentUser.object_id
})
const getUserList = createSelector(
    [
        (state: RendererRootState) => state.bdap.users,
        (state: RendererRootState) => state.bdap.pendingRequestLinks,
        (state: RendererRootState) => state.bdap.pendingAcceptLinks,
        (state: RendererRootState) => state.bdap.completeLinks,
        (state: RendererRootState) => typeof state.bdap.currentUser !== 'undefined' ? state.bdap.currentUser.object_full_path : undefined

    ],
    (users, pendingRequestLinks, pendingAcceptLinks, completeLinks, currentFqUser) => {
        //const allLinks = blinq(pendingRequestLinks).concat(pendingAcceptLinks)
        const existingLinks = completeLinks.concat(pendingAcceptLinks)
        return blinq(users)
            .leftOuterJoin(
                existingLinks,
                u => u.object_full_path,
                c => blinq([c.recipient_fqdn, c.requestor_fqdn]).first(n => n !== currentFqUser),
                (user, link) => ({ user, link }))
            .where(({ link }) => typeof link === 'undefined')
            .select(({ user }) => user) //all users, minus those for whom we already have a complete/pending accept link
            .leftOuterJoin(
                pendingRequestLinks,
                user => user.object_full_path,
                link => blinq([link.recipient_fqdn, link.requestor_fqdn]).first(n => n !== currentFqUser),
                (user, link) => ({
                    userName: user.object_id,
                    commonName: user.common_name,
                    state: typeof link === 'undefined' ? "normal" : "pending"
                } as BdapUser))
            .orderBy(u => u.commonName.toLowerCase())
            .thenBy(u => u.userName.toLowerCase())
            .toArray();
    })

const mapStateToProps = (state: RendererRootState /*, ownProps*/): AddLinksStateProps => {
    const currentUserName = getCurrentUserName(state)
   
    return {
        users: getUserList(state),
        currentUserName
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<AddLinksDispatchProps> = { ...BdapActions, push };

export default connect(mapStateToProps, mapDispatchToProps)(AddLinks)
