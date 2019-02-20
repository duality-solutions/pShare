import * as React from "react";
import styled from "styled-components"
import logosrc from "../../assets/svgs/logo_without_text.svg";
import mylinks from "../../assets/svgs/mylinks-32.svg";
import inbox from "../../assets/svgs/inbox-32.svg";
import outbox from "../../assets/svgs/outbox-32.svg";
import invites from "../../assets/svgs/invites-32.svg";
import pending from "../../assets/svgs/pending-32.svg";

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

const UserListAvatar = styled('img')<ImageProps>`
    src: ${props => props.src}
    width: 20px;
    height: 30px
`;

const MyLinksIcon:React.FunctionComponent<ImageProps> = 
    ({ width, height, margin }) => <SvgIcon src={mylinks} width={width || '50px'} height={height || "30px"} margin={margin || "0 10px"}/>
const InboxIcon:React.FunctionComponent<ImageProps> = 
    ({ width, height, margin }) => <SvgIcon src={inbox} width={width || '50px'} height={height || "30px"}  margin={margin || "0 10px"}/>
const OutboxIcon:React.FunctionComponent<ImageProps> = 
    ({ width, height, margin }) => <SvgIcon src={outbox} width={width || '50px'} height={height || "30px"}  margin={margin || "0 10px"}/>
const InvitesIcon:React.FunctionComponent<ImageProps> = 
    ({ width, height, margin }) => <SvgIcon src={invites} width={width || '50px'} height={height || "30px"}  margin={margin || "0 10px"}/>

const PendingIcon:React.FunctionComponent<ImageProps> =
    ({ width, height, margin }) => <SvgIcon src={pending} width={width || '50px'} height={height || "30px"} margin={margin || "0 10px"}/>
export {
    SvgIcon as AppLogo, PlainAppLogo, MyLinksIcon, InboxIcon, OutboxIcon, InvitesIcon, UserListAvatar, PendingIcon
}