import * as React from "react";
import styled from "styled-components"
import logosrc from "../../assets/svgs/logo_without_text.svg";
import mylinks from "../../assets/svgs/mylinks-32.svg";
import inbox from "../../assets/svgs/inbox-32.svg";
import outbox from "../../assets/svgs/outbox-32.svg";
import invites from "../../assets/svgs/invites-32.svg";

interface ImageProps {
    src? : string,
    width?: string,
    height?: string,
    margin?: string,
}

const SvgIcon = styled('img')<ImageProps>`
    src: ${props => props.src };
    width: ${props => props.width ? props.width : '100%'};
    height: ${props=> props.height ? props.height : '100px'};  
    margin: ${props => props.margin || '0'};  
    vertical-align: middle;
`

const PlainAppLogo = () => <SvgIcon src={logosrc} height="70px"/>


const MyLinksIcon:React.FunctionComponent<ImageProps> = 
    ({ width, height }) => <SvgIcon src={mylinks} width={width || '50px'} height={height || "30px"} margin="0 10px"/>
const InboxIcon = () => <SvgIcon src={inbox} width="50px" height="30px" margin="0 10px"/>
const OutboxIcon = () => <SvgIcon src={outbox} width="50px" height="30px" margin="0 10px"/>
const InvitesIcon = () => <SvgIcon src={invites} width="50px" height="30px" margin="0 10px"/>

export {
    SvgIcon as AppLogo, PlainAppLogo, MyLinksIcon, InboxIcon, OutboxIcon, InvitesIcon
}