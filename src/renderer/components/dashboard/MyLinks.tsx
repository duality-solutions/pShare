import { FunctionComponent } from "react";
import React from "react";
import { H1, Text } from "../ui-elements/Text";
import { MyLinksIcon, UserListAvatar, PendingIcon, BtnAddLinksIcon, ViewBtnIcon, CloseIcon } from "../ui-elements/Image";
import { UserList, UserListItem } from "../ui-elements/Dashboard";
import man from "../../assets/man.svg";
import Container from "../ui-elements/Container";
import { BdapUser } from "../../system/BdapUser";
import { LinkDisplayName } from "./LinkDisplayName";
import Input from "../ui-elements/Input";

export interface MyLinksStateProps {
    users: BdapUser[],
    allUsers: BdapUser[],
    userName: string,
    queryText: string,
    balance: number
}
export interface MyLinksDispatchProps {
    push: (pathname: string) => void,
    startViewSharedFiles: (userName: string) => void
    myLinksQueryTextChanged: (value: string) => void
}
export type MyLinksProps = MyLinksStateProps & MyLinksDispatchProps
export const MyLinks: FunctionComponent<MyLinksProps> = ({ users, push, startViewSharedFiles, userName, myLinksQueryTextChanged, queryText, allUsers, balance }: MyLinksProps) =>
    <>
        <div style={{ width: "100%", display: 'block', position:"relative" }}>
            <div style={{ padding: '6px', display: "block", position: "absolute", top: 0, left: 0 }}>Balance : {balance}</div>
            <div style={{ float: 'right', margin: '40px 20px 0 0' }}>Add Links
            <BtnAddLinksIcon onClick={() => push('/Dashboard/AddLinks')} />
            </div>
            <Container margin="7em 20% 5em 25%" height="100%" minWidth="50%">
                <H1 color="#4a4a4a"><MyLinksIcon width="60px" height="60px" margin="0" /> My Links ({userName})</H1>
                {allUsers.length > 0 ?
                    <>
                        <div style={{ display: 'flex' }}>
                            <Input id="myLinksInput" value={queryText}
                                onChange={e => myLinksQueryTextChanged(e.target.value)}
                                margin="20px 0 20px 0"
                                padding="0 20px"
                            />
                            {/* 
                        
                                NOTE

                                adding and removing the element below with a ternary statement
                                causes measurable performance issues 
                                
                                toggling css visibility below is an optimization that doesn't
                                cause document reflow
                                    
                                    
                            */}
                            <CloseIcon style={{
                                visibility: queryText.length > 0 ? "visible" : "hidden",
                                margin: '30px 0 0 0'
                            }}
                                onClick={() => {
                                    myLinksQueryTextChanged("");
                                    document.getElementById("myLinksInput")!.focus()
                                }} />
                        </div>
                        {
                            users.length > 0
                                ? <UserList>

                                    {users.map(u =>
                                        <UserListItem key={u.userName} >
                                            <div style={{ display: 'flex' }}>
                                                <UserListAvatar src={man} />
                                                <LinkDisplayName disabled={u.state === 'pending'} displayName={u.commonName} />
                                            </div>
                                            {u.state === 'pending'
                                                ? <div style={{ fontSize: "0.8em" }}> Pending <PendingIcon width="30px" height="30px" margin="0 0 0 1em" /></div>
                                                : <div style={{ fontSize: "0.8em" }}> View <ViewBtnIcon onClick={() => startViewSharedFiles(u.userName)} width="30px" height="30px" margin="0 0 0 1em" /></div>}
                                            {/* <Button onClick={() => requestFile({ fileId: "foo", ownerUserName: u.userName, requestorUserName: userName })} primary width="102px" minHeight="30px" fontSize="0.8em" > Request Test </Button></> */}
                                        </UserListItem>
                                    )}
                                </UserList>

                                : <Text color="#4a4a4a" margin="100px 5px 0 5px" fontSize="1.2em" fontWeight="400" align="center">No results. </Text>
                        }
                    </> :
                    <>
                        <Text color="#4a4a4a" margin="100px 5px 0 5px" fontSize="1.2em" fontWeight="400" align="center">You don't have any links yet . </Text>
                        <Text color="#4a4a4a" margin="5px 10px" fontSize="1.2em" fontWeight="400" align="center"> Go ahead, add someone to your list by clicking <strong>Add Links</strong> at the top-right. </Text>
                    </>
                }
                <div style={{ padding: "2.5em" }} />
            </Container>
        </div>
    </>
