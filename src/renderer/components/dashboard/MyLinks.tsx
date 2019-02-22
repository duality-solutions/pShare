import { FunctionComponent } from "react";
import React from "react";
import { H1, Text } from "../ui-elements/Text";
import { MyLinksIcon, UserListAvatar, PendingIcon, BtnAddLinksIcon } from "../ui-elements/Image";
import { UserList, UserListItem } from "../ui-elements/Dashboard";
import Button from "../ui-elements/Button";
import man from "../../assets/man.svg";
import Container from "../ui-elements/Container";
import { BdapUser } from "../../system/BdapUser";

export interface MyLinksStateProps {
    users: BdapUser[]
}
export interface MyLinksDispatchProps {
}
export type MyLinksProps = MyLinksStateProps & MyLinksDispatchProps & { history?: any }
export const MyLinks: FunctionComponent<MyLinksProps> = ({ users, history }: MyLinksProps) =>
    <>
        <div style={{ width: "100%", display: 'block' }}>
            <div style={{ float: 'right', margin: '40px 20px 0 0' }}>Add Links
            <BtnAddLinksIcon onClick={() => history.push('/Dashboard/AddLinks')} />
            </div>
            <Container margin="7em 20% 5em 25%" height="100%" minWidth="50%">
                <H1 color="#4a4a4a"><MyLinksIcon width="60px" height="60px" margin="0" /> My Links</H1>
                <UserList>
                    {users.map(u =>
                        <UserListItem key={u.userName} >
                            <div style={{ display: 'flex' }}>
                                <UserListAvatar src={man} />
                                <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center", height: "30px" }}>
                                    <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between" }}>
                                        <Text margin="0 0.2em 0 0.5em" disabled={u.state === 'pending-accept' || u.state === 'pending-request'}>{u.commonName.split(' ')[0]}</Text>
                                        <Text margin="0 0.2em" fontWeight="bold" disabled={u.state === 'pending-accept' || u.state === 'pending-request'}>{u.commonName.split(' ')[1]}</Text>
                                    </div>
                                </div>
                            </div>
                            {u.state === 'pending-accept' || u.state === 'pending-request' ?
                                <div style={{ fontSize: "0.8em" }}> Pending <PendingIcon width="30px" height="30px" margin="0 0 0 1em" /></div>
                                : <Button primary width="102px" minHeight="30px" fontSize="0.8em" > Send File </Button>}
                        </UserListItem>
                    )}
                </UserList>
                <div style={{ padding: "2.5em" }} />
            </Container>
        </div>
    </>