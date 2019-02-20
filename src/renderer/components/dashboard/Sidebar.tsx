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
                    <div style={{ borderBottom: "solid 0.1px #d2d2d2 "}}><PlainAppLogo /></div>
                        
                    <LI onClick={()=> console.log('mylinks is clicked')}>
                        <MyLinksIcon width="36px" height="36px" margin="0 0 0 1em"/>
                        <Text color="#4a4a4a" margin="0" align="center" fontSize="0.6em" fontWeight="bold">My Links</Text>
                    </LI>
                    <LI disabled>
                        <InboxIcon width="36px" height="36px" margin="0 0 0 0.9em"/>
                        <Text color="#4a4a4a" margin="0" align="center" fontSize="0.6em" fontWeight="bold">Inbox</Text>
                    </LI>
                    <LI disabled>
                        <OutboxIcon  width="36px" height="36px" margin="0 0 0 0.9em"/>
                        <Text color="#4a4a4a" margin="0" align="center" fontSize="0.6em" fontWeight="bold">Outbox</Text>
                    </LI>
                    <LI>
                        <InvitesIcon  width="36px" height="36px" margin="0 0 0 0.9em"/>
                        <Text color="#4a4a4a" margin="0" align="center" fontSize="0.6em" fontWeight="bold">Invites</Text>
                    </LI>
                </UL>
            </>
        )
    }
}