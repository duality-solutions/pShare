import { RendererRootState } from "../../reducers";
import { AddLinksStateProps, AddLinksDispatchProps, AddLinks } from "../../components/dashboard/AddLinks";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { BdapActions } from "../../../shared/actions/bdap";
import { connect } from "react-redux";
import { createSelector } from 'reselect'
import { BdapUser } from "../../system/BdapUser";
import { blinq } from "blinq";
import { push } from "connected-react-router";




const getUserList = createSelector(
    [
        (state: RendererRootState) => state.bdap.users,
        (state: RendererRootState) => state.bdap.pendingRequestLinks,
        (state: RendererRootState) => state.bdap.completeLinks,
        (state: RendererRootState) => typeof state.bdap.currentUser !== 'undefined' ? state.bdap.currentUser.object_full_path : undefined

    ],
    (users, pendingRequestLinks, completeLinks, currentFqUser) => {
        return blinq(users)
            .leftOuterJoin(
                completeLinks,
                u => u.object_full_path,
                c => blinq([c.recipient_fqdn, c.requestor_fqdn]).first(n => n !== currentFqUser),
                (u, c) => ({ u, c }))
            .where(({ c }) => typeof c === 'undefined')
            .select(({ u }) => u) //all users, minus those for whom we already have a complete link
            .leftOuterJoin(
                pendingRequestLinks,
                u => u.object_full_path,
                l => blinq([l.recipient_fqdn, l.requestor_fqdn]).first(n => n !== currentFqUser),
                (u, l) => ({
                    userName: u.object_id,
                    commonName: u.common_name,
                    state: typeof l === 'undefined' ? "normal" : "pending"
                } as BdapUser))
            .orderBy(u => u.commonName.toLowerCase())
            .thenBy(u => u.userName.toLowerCase())
            .toArray();
    })

const mapStateToProps = (state: RendererRootState /*, ownProps*/): AddLinksStateProps => {
    return {
        users: getUserList(state)
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<AddLinksDispatchProps> = { ...BdapActions, push };

export default connect(mapStateToProps, mapDispatchToProps)(AddLinks)
