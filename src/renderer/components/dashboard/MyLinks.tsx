import { FunctionComponent } from "react";
import React from "react";
import { BdapUser } from "../../../shared/reducers/bdap";
import { H1, Text } from "../ui-elements/Text";
import { MyLinksIcon, UserListAvatar, PendingIcon } from "../ui-elements/Image";
import { UserList, UserListItem } from "../ui-elements/Dashboard";
import Button from "../ui-elements/Button";
import man from "../../assets/man.svg";

export interface MyLinksStateProps {
    users: BdapUser[]
}
export interface MyLinksDispatchProps {

}
export type MyLinksProps = MyLinksStateProps & MyLinksDispatchProps
export const MyLinks: FunctionComponent<MyLinksProps> = ({ users }: MyLinksProps) =>
    <>
        <H1 color="#4a4a4a"><MyLinksIcon width="60px" height="60px" margin="0"/> My Links</H1>
        <UserList>
        {users.map(u => 
            <UserListItem key={u.userName} >
                <div style={{display: 'flex'}}>
                <UserListAvatar src={man} />
                <div style={{ display: 'flex', flexDirection:"column", justifyContent:"center", height:"30px"}}>
                <div style={{ display: 'flex', flexDirection:"row", justifyContent:"space-between"}}>
                <Text margin="0 0.2em 0 0.5em" disabled={u.state === 'pending'}>{u.commonName.split(' ')[0]}</Text> 
                <Text margin="0 0.2em" fontWeight="bold" disabled={u.state === 'pending'}>{u.commonName.split(' ')[1]}</Text>
                </div>
                </div> 
                </div>
                {u.state === 'pending' ? 
                    <div style={{ fontSize:"0.8em" }}> Pending <PendingIcon width="30px" height="30px" margin="0 0 0 1em"/></div>
                    : <Button primary width="102px" minHeight="30px" fontSize="0.8em" > Send File </Button> }
            </UserListItem>
        )}
        </UserList>
        <div style={{ padding: "2.5em"}}/>
    </>