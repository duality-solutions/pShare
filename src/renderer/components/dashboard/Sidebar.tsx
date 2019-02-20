import React, { Component } from "react";
import { UL, LI } from "../ui-elements/Dashboard";
import { PlainAppLogo, MyLinksIcon, InboxIcon, OutboxIcon, InvitesIcon } from "../ui-elements/Image";
import Text from "../ui-elements/Text";

export interface SidebarStateProps {
}

export interface SidebarDispatchProps {
}
type SidebarProps = SidebarDispatchProps & SidebarStateProps

interface SidebarComponentState {
}

export class Sidebar extends Component<SidebarProps, SidebarComponentState> {
    constructor(props: SidebarProps){
        super(props)
    }
    render() {
        return (
            <>
                <UL>
                    <div style={{ borderBottom: "solid 0.1px #D3D3D3 "}}><PlainAppLogo /></div>
                        
                    <LI onClick={()=> console.log('mylinks is clicked')}>
                        <MyLinksIcon />
                        <Text margin="0" align="center">My Links</Text>
                    </LI>
                    <LI>
                        <InboxIcon />
                        <Text margin="0" align="center">Inbox</Text>
                    </LI>
                    <LI>
                        <OutboxIcon />
                        <Text margin="0" align="center">Outbox</Text>
                    </LI>
                    <LI>
                        <InvitesIcon />
                        <Text margin="0" align="center">Invites</Text>
                    </LI>
                </UL>
            </>
        )
    }
}