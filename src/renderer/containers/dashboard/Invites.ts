import { RendererRootState } from "../../reducers";
import { Invites as Invites_, InvitesDispatchProps, InvitesStateProps, Invite } from "../../components/dashboard/Invites";
import { MapPropsToDispatchObj } from "../../system/MapPropsToDispatchObj";
import { BdapActions } from "../../../shared/actions/bdap";
import { connect } from "react-redux";
import { createSelector } from 'reselect'
import { blinq } from "blinq";
import { filterDeniedUsers } from "./helpers/filterDeniedUsers";

const getInvites = createSelector(
    [
        (state: RendererRootState) => state.bdap.users,
        (state: RendererRootState) => state.bdap.pendingAcceptLinks,
        (state: RendererRootState) => state.bdap.deniedLinks,
        (state: RendererRootState) => typeof state.bdap.currentUser !== 'undefined' ? state.bdap.currentUser.object_full_path : undefined,
        (state: RendererRootState) => typeof state.bdap.currentUser !== 'undefined' ? state.bdap.currentUser.object_id : undefined

    ],
    (users, pendingAcceptLinks, deniedLinks, currentFqUser, currentUserName) => {
        return filterDeniedUsers(blinq(users), deniedLinks)
            .leftOuterJoin(
                pendingAcceptLinks,
                user => user.object_full_path,
                link => blinq([link.recipient_fqdn, link.requestor_fqdn]).firstOrDefault(fqdn => currentFqUser !== fqdn),
                (user, link) => ({ user, link })
            )
            .where(({ link }) => typeof link !== 'undefined')
            .select(({ user, link }) => {
                if (typeof link === 'undefined') {
                    throw Error("link should be defined")
                }
                return ({
                    user: {
                        userName: user.object_id,
                        commonName: user.common_name,
                        state: "pending"
                    },
                    link: (typeof link === 'undefined'
                        ? undefined
                        : currentFqUser === link.requestor_fqdn
                            ? { requestor: currentUserName, recipient: user.object_id }
                            : { recipient: currentUserName, requestor: user.object_id }),
                    link_message: (typeof link === 'undefined' ? undefined : link.link_message)
                } as Invite);
            })
            .orderBy(({ user }) => user.commonName.toLowerCase())
            .thenBy(({ user }) => user.userName.toLowerCase())
            .toArray()
    })

const mapStateToProps = (state: RendererRootState /*, ownProps*/): InvitesStateProps => {
    const invites = getInvites(state);
    return {
        invites: invites
    };
};

const mapDispatchToProps: MapPropsToDispatchObj<InvitesDispatchProps> = { ...BdapActions };

export const Invites = connect(mapStateToProps, mapDispatchToProps)(Invites_)
