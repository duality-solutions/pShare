import React, { FunctionComponent } from "react";
import { UL, LI } from "../ui-elements/Dashboard";
import { PlainAppLogo, MyLinksIcon, InboxIcon, OutboxIcon, InvitesIcon } from "../ui-elements/Image";
import Text from "../ui-elements/Text";

export interface SidebarStateProps {
    location: string
}
export interface SidebarDispatchProps {
    push: (pathname: string) => void
}

export type SidebarProps = SidebarStateProps & SidebarDispatchProps


export const Sidebar: FunctionComponent<SidebarProps> = ({ push, location }) => <>
    <UL>
        <div style={{ borderBottom: "solid 0.1px #d2d2d2 " }}><PlainAppLogo /></div>
        {
            tabs.map((t, idx) => {
                const isSelected = t.isSelected(location);
                return (
                    <LI key={idx}
                        disabled={t.disabled}
                        onClick={t.disabled ? undefined : () => push(t.location)}
                        dark={isSelected}>

                        <t.icon selected={isSelected} />

                        <Text color={isSelected ? "white" : "#4a4a4a"}
                            margin="0"
                            align="center"
                            fontSize="0.6em"
                            fontWeight="bold">{
                                t.text
                            }
                        </Text>
                    </LI>
                );
            })
        }
    </UL>
</>

interface IconProps {
    selected: boolean
}
interface TabInfo {
    location: string
    icon: FunctionComponent<IconProps>
    text: string
    isSelected: (pathname: string) => boolean,
    disabled?: boolean
}
const tabs: TabInfo[] = [
    {
        location: '/Dashboard/MyLinks',
        icon: ({ selected }) =>
            <MyLinksIcon
                white={selected}
                width="36px"
                height="36px"
                margin="0 0 0 1em" />,
        text: "My Links",
        isSelected: (pathname: string) => pathname === '/Dashboard/MyLinks' || pathname === '/Dashboard/AddLinks' 
                                          || pathname === '/Dashboard/SharedFiles'
    },
    {
        location: '/Dashboard/Inbox',
        icon: () =>
            <InboxIcon
                width="36px"
                height="36px"
                margin="0 0 0 0.9em" />,
        text: "Inbox",
        isSelected: (pathname: string) => pathname === '/Dashboard/Inbox',
        disabled: true
    },
    {
        location: '/Dashboard/Outbox',
        icon: () =>
            <OutboxIcon
                width="36px"
                height="36px"
                margin="0 0 0 0.9em" />,
        text: "Outbox",
        isSelected: (pathname: string) => pathname === '/Dashboard/Outbox',
        disabled: true
    },
    {
        location: '/Dashboard/Invites',
        icon: ({ selected }) =>
            <InvitesIcon
                white={selected}
                width="36px"
                height="36px"
                margin="0 0 0 0.9em" />,
        text: "Invites",
        isSelected: (pathname: string) => pathname === '/Dashboard/Invites',
    },

]
