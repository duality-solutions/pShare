import { FunctionComponent } from "react";
import React from "react";
import { BdapUser } from "../../../shared/reducers/bdap";
import { H1, Text } from "../ui-elements/Text";
import { InvitesIcon, UserListAvatar } from "../ui-elements/Image";
import { UserList, UserListItem } from "../ui-elements/Dashboard";
import Container from "../ui-elements/Container";
import man from "../../assets/man.svg";
import Button from "../ui-elements/Button";

const userlist: Array<string> = [
    'Hannah Ashley', 'Heather Atchison', 'Krisitan Banister'
]

export interface InvitesStateProps {
    users: BdapUser[]
}
export interface InvitesDispatchProps {
}
export type InvitesProps = InvitesStateProps & InvitesDispatchProps
export const Invites: FunctionComponent<InvitesProps> = ({ users }: InvitesProps) =>
    <>
        <div style={{ width: "100%", display: 'block' }}>
            <Container margin="7em 20% 5em 25%" height="100%" minWidth="50%">
                <H1 color="#4a4a4a"><InvitesIcon width="50px" height="50px" margin="0" /> Invites</H1>
                <UserList>
                    {userlist.map((u, idx) =>
                        <UserListItem key={idx}>
                            <div style={{ display: 'flex' }}>
                                <UserListAvatar src={man} />
                                <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center", height: "30px" }}>
                                    <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text margin="0 0.2em 0 0.5em" >{u.split(" ")[0]}</Text>
                                        <Text margin="0 0.2em" fontWeight="bold">{u.split(" ")[1]}</Text>
                                    </div></div>
                            </div>
                            <div>
                                <Button primary width="102px" minHeight="30px" fontSize="0.8em" margin="0 5px 0 0"> Accept </Button>
                                <Button width="102px" minHeight="30px" fontSize="0.8em" > Decline </Button>
                            </div>
                        </UserListItem>
                    )}
                </UserList>
                <div style={{ padding: "2.5em" }} />
            </Container>
        </div>
    </>