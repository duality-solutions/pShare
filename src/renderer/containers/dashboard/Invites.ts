import { RendererRootState } from "../../reducers";
import { Invites as Invites_, InvitesDispatchProps, InvitesStateProps } from "../../components/dashboard/Invites";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { BdapActions } from "../../../shared/actions/bdap";
import { connect } from "react-redux";
import { createSelector } from 'reselect'
import { BdapUser } from "../../system/BdapUser";
import { blinq } from "blinq";




const getUserList = createSelector(
    [
        (state: RendererRootState) => state.bdap.users,
        (state: RendererRootState) => state.bdap.pendingAcceptLinks,
        (state: RendererRootState) => typeof state.bdap.currentUser !== 'undefined' ? state.bdap.currentUser.object_full_path : undefined

    ],
    (users, pendingAcceptLinks, currentFqUser) => {
        return blinq(users)
            .leftOuterJoin(
                pendingAcceptLinks,
                u => u.object_full_path,
                a => blinq([a.recipient_fqdn, a.requestor_fqdn]).firstOrDefault(fqdn => currentFqUser !== fqdn),
                (u, a) => ({ u, a })
            )
            .where(({ a }) => typeof a !== 'undefined')
            .select(({ u }) => ({
                userName: u.object_id,
                commonName: u.common_name,
                state: "pending-request"
            } as BdapUser))
            .orderBy(u => u.commonName.toLowerCase())
            .thenBy(u => u.userName.toLowerCase())
            .toArray()
    })

const mapStateToProps = (state: RendererRootState /*, ownProps*/): InvitesStateProps => {
    return {
        users: getUserList(state)
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<InvitesDispatchProps> = { ...BdapActions };

export const Invites = connect(mapStateToProps, mapDispatchToProps)(Invites_)
