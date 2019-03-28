import { FunctionComponent } from "react";
import React from "react";
import { H1 } from "../ui-elements/Text";
import { InvitesIcon, UserListAvatar } from "../ui-elements/Image";
import { UserList, UserListItem } from "../ui-elements/Dashboard";
import Container from "../ui-elements/Container";
import man from "../../assets/man.svg";
import Button from "../ui-elements/Button";
import { BdapUser } from "../../../renderer/system/BdapUser";
import { LinkDisplayName } from "./LinkDisplayName";
import { LinkBase } from "../../../shared/actions/payloadTypes/LinkBase";
import { BdapActions } from "../../../shared/actions/bdap";
import { PickedDispatchProps } from "../../system/PickedDispatchProps";



export interface Invite {
    user: BdapUser
    link: LinkBase
}
export interface InvitesStateProps {
    invites: Invite[]
}

export type InvitesDispatchProps = PickedDispatchProps<typeof BdapActions, "beginAcceptLink">
export type InvitesProps = InvitesStateProps & InvitesDispatchProps

export const Invites: FunctionComponent<InvitesProps> = ({ invites, beginAcceptLink }: InvitesProps) =>
    <>
        <div style={{ width: "100%", display: 'block' }}>
            <Container margin="7em 20% 5em 25%" height="100%" minWidth="50%">
                <H1 color="#4a4a4a"><InvitesIcon width="50px" height="50px" margin="0" /> Invites</H1>
                <UserList>
                    {invites.map(({ user, link }, idx) =>
                        <UserListItem key={idx}>
                            <div style={{ display: 'flex' }}>
                                <UserListAvatar src={man} />
                                <LinkDisplayName displayName={user.commonName} />

                            </div>
                            <div>
                                <Button primary width="102px" minHeight="30px" fontSize="0.8em" margin="0 5px 0 0" onClick={() => beginAcceptLink(link)}> Accept </Button>
                                <Button width="102px" minHeight="30px" fontSize="0.8em" > Decline </Button>
                            </div>
                        </UserListItem>
                    )}
                </UserList>
                <div style={{ padding: "2.5em" }} />
            </Container>
        </div>
    </>