import React, { FunctionComponent } from "react";
import { UL, LI } from "../ui-elements/Dashboard";
import { PlainAppLogo, MyLinksIcon, InboxIcon, OutboxIcon, InvitesIcon } from "../ui-elements/Image";
import Text from "../ui-elements/Text";
import { RouteComponentProps } from "react-router";


export const Sidebar: FunctionComponent<RouteComponentProps<any>> = ({ history, location }) => <>
    <UL>
        <div style={{ borderBottom: "solid 0.1px #d2d2d2 " }}><PlainAppLogo /></div>
        <LI onClick={() => history.push('/Dashboard/MyLinks')}
            dark={location.pathname === '/Dashboard/MyLinks' ||
                location.pathname === '/Dashboard/AddLinks'}>
            <MyLinksIcon white={location.pathname === '/Dashboard/MyLinks' ||
                location.pathname === '/Dashboard/AddLinks'}
                width="36px" height="36px" margin="0 0 0 1em" />
            <Text color={(location.pathname === '/Dashboard/MyLinks' || location.pathname === '/Dashboard/AddLinks') ? "white" : "#4a4a4a"}
                margin="0" align="center" fontSize="0.6em" fontWeight="bold">My Links</Text>
        </LI>
        <LI disabled>
            <InboxIcon width="36px" height="36px" margin="0 0 0 0.9em" />
            <Text color="#4a4a4a" margin="0" align="center" fontSize="0.6em" fontWeight="bold">Inbox</Text>
        </LI>
        <LI disabled>
            <OutboxIcon width="36px" height="36px" margin="0 0 0 0.9em" />
            <Text color="#4a4a4a" margin="0" align="center" fontSize="0.6em" fontWeight="bold">Outbox</Text>
        </LI>
        <LI onClick={() => history.push('/Dashboard/Invites')}
            dark={location.pathname === '/Dashboard/Invites'}>
            <InvitesIcon white={location.pathname === '/Dashboard/Invites'}
                width="36px" height="36px" margin="0 0 0 0.9em" />
            <Text color={location.pathname === '/Dashboard/Invites' ? "white" : "#4a4a4a"}
                margin="0" align="center" fontSize="0.6em" fontWeight="bold">Invites</Text>
        </LI>
    </UL>
</>

