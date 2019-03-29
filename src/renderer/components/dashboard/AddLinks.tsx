import { Component, FunctionComponent } from "react";
import React from "react";
import { H1, Text } from "../ui-elements/Text";
import { AddLinksIcon, UserListAvatar, CloseIcon, BtnAddLinksIcon, RequestSentIcon } from "../ui-elements/Image";
import { UserList, UserListItem } from "../ui-elements/Dashboard";
import man from "../../assets/man.svg";
import Container from "../ui-elements/Container";
import { BdapUser } from "../../system/BdapUser";
import { LinkDisplayName } from "./LinkDisplayName";
import { BdapActions } from "../../../shared/actions/bdap";
import { PickedDispatchProps } from "../../system/PickedDispatchProps";
import { Box } from "../ui-elements/Box";
import Modal from "../ui-elements/Modal";
import Button from "../ui-elements/Button";
import Input from "../ui-elements/Input";

export interface AddLinksStateProps {
    users: BdapUser[]
    currentUserName: string
}
export type AddLinksDispatchProps = PickedDispatchProps<typeof BdapActions, "beginCreateLinkRequest"> & { push: (pathname: string) => void }
export type AddLinksProps = AddLinksStateProps & AddLinksDispatchProps

interface AddLinksComponentStateProps {
    requestModal: boolean, recipent: string
}

const CustomRequestMessage: FunctionComponent<{ close: ()=> void, send: ()=> void }> = ({ close, send }) => (
    <Modal >
        <Box background="#fafafa" margin="40vh auto 0 auto" borderRadius="5px" padding="1em 1.5em">
            <Text fontSize="1.2em" fontWeight="600" margin="0" color="#4a4a4a">
                Invite Message
            </Text>
            <Input margin="10px 0" padding="0 1em" width="420px"/>
            <Box align="right" width="100%" >
            <Button onClick={()=> close()} width="100px" margin="0 8px 0 0">
              <Text margin="0" fontSize="0.7em" color="#2e77d0" align="center">Cancel</Text>
            </Button>
            <Button onClick={()=> send()} primary width="100px" margin="0 8px 0 0">
                <Text margin="0" fontSize="0.7em" color="white" align="center">Send Request</Text>
            </Button>
            </Box>
        </Box> 
    </Modal>
)

export class AddLinks extends Component<AddLinksProps, AddLinksComponentStateProps> {
    constructor(props: AddLinksProps){
        super(props)
        this.state = {
            requestModal: false,
            recipent: ''
        }
    }
    render() {
        const { users, beginCreateLinkRequest, currentUserName, push } = this.props
        return(
            <>
            {this.state.requestModal && 
                <CustomRequestMessage 
                        close={()=> this.setState({ requestModal: false })} 
                        send={()=> {
                                    beginCreateLinkRequest({ requestor: currentUserName, recipient: this.state.recipent })
                                    this.setState({ requestModal: false })
                                }}
                />}
            <div style={{ width: "100%", display: 'block' }}>
                <div style={{ float: 'right', margin: '40px 0 0 0' }}>
                    <CloseIcon margin="0 40px 0 0" onClick={() => push('/Dashboard/MyLinks')} />
                    <Text margin="5px 0 0 5px" fontSize="0.8em">finish</Text>
                </div>
                <Container margin="7em 20% 5em 25%" height="100%" minWidth="50%">
                    <H1 color="#4a4a4a"><AddLinksIcon width="40px" height="40px" margin="0" /> Add Links</H1>
                    <UserList>
                        {users.map(u =>
                        <>
                            <UserListItem key={u.userName} >
                                <div style={{ display: 'flex' }}>
                                    <UserListAvatar src={man} />
                                    <LinkDisplayName disabled={u.state === 'pending'} displayName={u.commonName} />
                                </div>
                                {u.state === 'pending' ?
                                    <div style={{ fontSize: "0.8em" }}> Request sent <RequestSentIcon width="30px" height="30px" margin="0 0 0 1em" /></div>
                                    : <div style={{ fontSize: "0.7em" }} 
                                            onClick={() => this.setState({ requestModal: true, recipent: u.userName })}> 
                                                Request 
                                            <BtnAddLinksIcon width="30px" height="30px" margin="0 0 0 1em" />
                                       </div>
                                }
                            </UserListItem>
                        </>
                        )}
                    </UserList>
                    <div style={{ padding: "2.5em" }} />
                </Container>
            </div>
        </>
        )
    }
    
}

