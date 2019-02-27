import { FunctionComponent } from "react";
import React from "react";
import { H1, Text } from "../ui-elements/Text";
import { AddLinksIcon, UserListAvatar, CloseIcon, BtnAddLinksIcon, RequestSentIcon } from "../ui-elements/Image";
import { UserList, UserListItem } from "../ui-elements/Dashboard";
import man from "../../assets/man.svg";
import Container from "../ui-elements/Container";
import { BdapUser } from "../../system/BdapUser";
import { LinkDisplayName } from "./LinkDisplayName";
import { LinkBase } from "../../../shared/actions/payloadTypes/LinkBase";

export interface AddLinksStateProps {
    users: BdapUser[]
    currentUserName: string
}
export interface AddLinksDispatchProps {
    push: (pathname: string) => void
    startCreateLinkRequest: (opts: LinkBase) => void
}
export type AddLinksProps = AddLinksStateProps & AddLinksDispatchProps
export const AddLinks: FunctionComponent<AddLinksProps> = ({ currentUserName, users, push, startCreateLinkRequest }: AddLinksProps) =>
    <>
        <div style={{ width: "100%", display: 'block' }}>
            <div style={{ float: 'right', margin: '40px 0 0 0' }}>
                <CloseIcon margin="0 40px 0 0" onClick={() => push('/Dashboard/MyLinks')} />
                <Text margin="5px 0 0 5px" fontSize="0.8em">finish</Text>
            </div>
            <Container margin="7em 20% 5em 25%" height="100%" minWidth="50%">
                <H1 color="#4a4a4a"><AddLinksIcon width="40px" height="40px" margin="0" /> Add Links</H1>
                <UserList>
                    {users.map(u =>
                        <UserListItem key={u.userName} >
                            <div style={{ display: 'flex' }}>
                                <UserListAvatar src={man} />
                                <LinkDisplayName disabled={u.state === 'pending'} displayName={u.commonName} />

                            </div>
                            {u.state === 'pending' ?
                                <div style={{ fontSize: "0.8em" }}> Request sent <RequestSentIcon width="30px" height="30px" margin="0 0 0 1em" /></div>
                                : <div style={{ fontSize: "0.7em" }} onClick={() => startCreateLinkRequest({ requestor: currentUserName, recipient: u.userName })}> Request <BtnAddLinksIcon width="30px" height="30px" margin="0 0 0 1em" /></div>
                            }
                        </UserListItem>
                    )}
                </UserList>
                <div style={{ padding: "2.5em" }} />
            </Container>
        </div>
    </>