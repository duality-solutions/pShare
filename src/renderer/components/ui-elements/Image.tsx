import * as React from "react";
import styled from "styled-components"
import logosrc from "../../assets/svgs/logo_without_text.svg";
import mylinks from "../../assets/svgs/mylinks-32.svg";
import mylinkswhite from "../../assets/svgs/mylinks-32-white.svg";
import inbox from "../../assets/svgs/inbox-32.svg";
import inboxwhite from "../../assets/svgs/inbox-32-white.svg";
import outbox from "../../assets/svgs/outbox-32.svg";
import outboxwhite from "../../assets/svgs/outbox-32-white.svg";
import invites from "../../assets/svgs/invites-32.svg";
import inviteswhite from "../../assets/svgs/invites-32-white.svg";
import pending from "../../assets/svgs/pending-32.svg";
import addLinksBtn from "../../assets/svgs/btn-add-32.svg";
import addlinks from "../../assets/svgs/add-32.svg";
import requestsent from "../../assets/svgs/request-sent-32.svg";
import close from "../../assets/svgs/close-32.svg";
import viewbtn from "../../assets/svgs/viewbtn.svg";
import doc from "../../assets/svgs/p-share-doc.svg";

interface ImageProps {
    src? : string,
    width?: string,
    height?: string,
    margin?: string,
    white?: boolean,
    onClick?: ()=> void,
}

const SvgIcon = styled('img')<ImageProps>`
    src: ${props => props.src };
    width: ${props => props.width ? props.width : '100%'};
    height: ${props=> props.height ? props.height : '100px'};  
    margin: ${props => props.margin || '0'};  
    vertical-align: middle;
    background: ${props=> props.white ? '#737373' : ''};
`;

const PlainAppLogo = () => <SvgIcon src={logosrc} height="70px"/>

const UserListAvatar = styled('img')<ImageProps>`
    src: ${props => props.src}
    width: 20px;
    height: 30px;
`;

const MyLinksIcon:React.FunctionComponent<ImageProps> = 
    ({ width, height, margin, white }) => <SvgIcon src={white ? mylinkswhite: mylinks} width={width || '50px'} height={height || "30px"} margin={margin || "0 10px"}/>
const InboxIcon:React.FunctionComponent<ImageProps> = 
    ({ width, height, margin, white }) => <SvgIcon src={white? inboxwhite: inbox} width={width || '50px'} height={height || "30px"}  margin={margin || "0 10px"}/>
const OutboxIcon:React.FunctionComponent<ImageProps> = 
    ({ width, height, margin, white }) => <SvgIcon src={white? outboxwhite: outbox} width={width || '50px'} height={height || "30px"}  margin={margin || "0 10px"}/>
const InvitesIcon:React.FunctionComponent<ImageProps> = 
    ({ width, height, margin, white }) => <SvgIcon src={white? inviteswhite: invites} width={width || '50px'} height={height || "30px"}  margin={margin || "0 10px"}/>

const PendingIcon:React.FunctionComponent<ImageProps> =
    ({ width, height, margin }) => <SvgIcon src={pending} width={width || '50px'} height={height || "30px"} margin={margin || "0 10px"}/>


const BtnAddLinksIcon:React.FunctionComponent<ImageProps> = 
    ({ width, height, margin, onClick }) => <SvgIcon onClick={onClick} style={{ cursor: 'pointer'}} src={addLinksBtn} width={width || '50px'} height={height || "30px"} margin={margin || "0 10px"}/>
const AddLinksIcon:React.FunctionComponent<ImageProps> =
    ({ width, height, margin }) =>  <SvgIcon src={addlinks} width={width || '50px'} height={height || "30px"} margin={margin || "0 10px"}/>
const CloseIcon:React.FunctionComponent<ImageProps> =
    ({ width, height, margin, onClick }) =>  <SvgIcon onClick={onClick} style={{ cursor: 'pointer'}} src={close} width={width || '50px'} height={height || "30px"} margin={margin || "0 10px"}/>
const RequestSentIcon:React.FunctionComponent<ImageProps> =
    ({ width, height, margin }) =>  <SvgIcon src={requestsent} width={width || '50px'} height={height || "30px"} margin={margin || "0 10px"}/>

const ViewBtnIcon:React.FunctionComponent<ImageProps> = 
    ({ width, height, margin, onClick }) => <SvgIcon style={{ cursor: 'pointer'}} onClick={onClick} src={viewbtn} width={width || '50px'} height={height || "30px"} margin={margin || "0 10px"}/>

const DocumentSvg:React.FunctionComponent<ImageProps> = 
    ({ width, height, margin, onClick }) => <SvgIcon onClick={onClick} src={doc} width={width || '50px'} height={height || "30px"} margin={margin || "0 10px"}/>

export {
    SvgIcon as AppLogo, PlainAppLogo, MyLinksIcon, InboxIcon, OutboxIcon, RequestSentIcon, ViewBtnIcon,
    InvitesIcon, UserListAvatar, PendingIcon, BtnAddLinksIcon, AddLinksIcon, CloseIcon, DocumentSvg
}