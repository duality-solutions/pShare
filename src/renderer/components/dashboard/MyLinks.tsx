import { FunctionComponent } from "react";
import React from "react";
import { BdapUser } from "../../../shared/reducers/bdap";
import { H1, Text } from "../ui-elements/Text";
import { MyLinksIcon } from "../ui-elements/Image";
import { UserList, UserListItem } from "../ui-elements/Dashboard";
import Button from "../ui-elements/Button";

export interface MyLinksStateProps {
    users: BdapUser[]
}
export interface MyLinksDispatchProps {

}
export type MyLinksProps = MyLinksStateProps & MyLinksDispatchProps
export const MyLinks: FunctionComponent<MyLinksProps> = ({ users }: MyLinksProps) =>
    <>
        <H1><MyLinksIcon width="60px" height="60px"/> My Links</H1>
        <UserList>
        {users.map(u => 
            <UserListItem key={u.userName}><Text>{u.commonName}</Text> <Button primary width="100px" > Send File </Button> </UserListItem>
        )}
        </UserList>
    </>