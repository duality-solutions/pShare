import { FunctionComponent } from "react";
import React from "react";
import { H1, Text } from "../ui-elements/Text";
import { InvitesIcon, UserListAvatar } from "../ui-elements/Image";
import { UserList, InviteListItem } from "../ui-elements/Dashboard";
import Container from "../ui-elements/Container";
import man from "../../assets/man.svg";
import Button from "../ui-elements/Button";
import { BdapUser } from "../../../renderer/system/BdapUser";
import { LinkDisplayName } from "./LinkDisplayName";
import { LinkBase } from "../../../shared/actions/payloadTypes/LinkBase";
import { BdapActions } from "../../../shared/actions/bdap";
import { PickedDispatchProps } from "../../system/PickedDispatchProps";
import BalanceIndicator from "../../containers/dashboard/BalanceIndicator";



export interface Invite {
    user: BdapUser
    link: LinkBase
    link_message: string
}
export interface InvitesStateProps {
    invites: Invite[]
}

export type InvitesDispatchProps = PickedDispatchProps<typeof BdapActions, "beginAcceptLink" | "beginDeclineLink">
export type InvitesProps = InvitesStateProps & InvitesDispatchProps
export const Invites: FunctionComponent<InvitesProps> = ({ invites, beginAcceptLink, beginDeclineLink }: InvitesProps) =>
    <>
        <div style={{ width: "100%", display: 'block', position: "relative" }}>
            <BalanceIndicator />
            <Container margin="7em 20% 5em 25%" height="100%" minWidth="50%">
                <H1 color="#4a4a4a"><InvitesIcon width="50px" height="50px" margin="0" /> Invites</H1>
                <div style={{
                    border: 'solid 0.2px #d2d2d2',
                    height: '0.2px',
                    marginTop: '10px',
                    width: '100%'
                }} />
                {invites.length > 0 ?
                    <UserList>
                        {invites.map(({ user, link, link_message }, idx) =>
                            <InviteListItem key={idx} msg={link_message}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex' }}>
                                        <UserListAvatar src={man} />
                                        <LinkDisplayName displayName={user.commonName} />
                                    </div>
                                    <div>
                                        <Button primary width="102px" minHeight="30px"
                                            fontSize="0.8em" margin="0 5px 0 0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                beginAcceptLink(link);
                                            }}>
                                            Accept
                            </Button>
                                        <Button width="102px" minHeight="30px" fontSize="0.8em" > Decline </Button>
                                    </div>
                                </div>
                            </InviteListItem>
                        )}
                    </UserList> :
                    <Text color="#4a4a4a" fontSize="1.2em" fontWeight="400" margin="200px 0 0 0" align="center">
                        <strong>You have no invites yet 😕</strong>
                    </Text>
                }
                <div style={{ padding: "2.5em" }} />
            </Container>
        </div>
    </>
