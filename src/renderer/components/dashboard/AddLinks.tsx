import { FunctionComponent } from "react";
import React from "react";
import { BdapUser } from "../../../shared/reducers/bdap";
import { H1, Text } from "../ui-elements/Text";
import { AddLinksIcon, UserListAvatar, CloseIcon, BtnAddLinksIcon, RequestSentIcon } from "../ui-elements/Image";
import { UserList, UserListItem } from "../ui-elements/Dashboard";
import man from "../../assets/man.svg";
import Container from "../ui-elements/Container";

export interface AddLinksStateProps {
    users: BdapUser[]
}
export interface AddLinksDispatchProps {
}
export type AddLinksProps = AddLinksStateProps & AddLinksDispatchProps & { history?: any }
export const AddLinks: FunctionComponent<AddLinksProps> = ({ users, history }: AddLinksProps) =>
    <>  
        <div style={{width:"100%", display:'block'}}>
        <div style={{float:'right', margin:'40px 0 0 0'}}>
        <CloseIcon margin="0 40px 0 0" onClick={()=> history.push('/Dashboard/MyLinks') }/>
        <Text margin="5px 0 0 5px" fontSize="0.8em">finnish</Text>
        </div>
        <Container margin="7em 20% 5em 25%" height="100%" minWidth="50%">
        <H1 color="#4a4a4a"><AddLinksIcon width="40px" height="40px" margin="0"/> Add Links</H1>
        <UserList>
        {users.map(u => 
            <UserListItem key={u.userName} >
                <div style={{display: 'flex'}}>
                <UserListAvatar src={man} />
                <div style={{ display: 'flex', flexDirection:"column", justifyContent:"center", height:"30px"}}>
                <div style={{ display: 'flex', flexDirection:"row", justifyContent:"space-between"}}>
                <Text margin="0 0.2em 0 0.5em" >{u.commonName.split(' ')[0]}</Text> 
                <Text margin="0 0.2em" fontWeight="bold" >{u.commonName.split(' ')[1]}</Text>
                </div>
                </div> 
                </div>
                    {u.state === 'pending' ? 
                    <div style={{ fontSize:"0.8em" }}> Request sent <RequestSentIcon width="30px" height="30px" margin="0 0 0 1em"/></div>
                    : <div style={{ fontSize:"0.7em" }}> Request <BtnAddLinksIcon width="30px" height="30px" margin="0 0 0 1em"/></div>
                }
            </UserListItem>
        )}
        </UserList>
        <div style={{ padding: "2.5em"}}/>
        </Container>
        </div>
    </>