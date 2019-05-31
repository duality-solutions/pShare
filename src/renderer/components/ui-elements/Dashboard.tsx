import styled from 'styled-components'
import * as React from 'react';
import { Text } from './Text';

const StyledDashboardContainer = styled('div')`
    height: 100vh;
    width: 100vw;
    display: flex;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    overflow:hidden;
`;

const SidebarContainer = styled('div')`
    display: flex;
    height:100vh;
    width: 64px;
    direction: column;
    min-width: 64px;
    background: #fafafa;
    border-right: solid 0.1px #d2d2d2;
    max-height:100vh;
    `;

const MainContentContainer = styled('div') <{ disabled?: boolean }>`
    display: flex;
    height:100%;
    z-index: ${props => props.disabled ? -1 : 0}
    width: 100%;
    direction: column;
    background: white;
    overflow-y: auto;
    `;

const SidebarList = styled('ul')`
    list-style-type: none;
    margin: 0;
    -webkit-margin-before: 0em;
    -webkit-margin-after: 0em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    -webkit-padding-start: 0px;
`;


const SidedbarListItem = styled('li') <{ disabled?: boolean, dark?: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content:center;
    cursor: ${props => props.disabled ? 'default' : 'pointer'};
    height: 64px;
    max-height: 64px;
    border-bottom: solid 0.1px #d2d2d2;
    opacity: ${props => props.disabled ? 0.4 : 1};
    background: ${props => props.dark ? '#4f4f4f' : ''};
`;

const UserList = styled('ul')`
    list-style-type: none;
    margin: 20px 0 0 0;
    -webkit-margin-before: 20px;
    -webkit-margin-after: 0em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    -webkit-padding-start: 0px;
`;

const UserListItem = styled('li') <{ disabled?: boolean }>`
    display: flex;
    direction: row;
    justify-content: space-between;
    padding: 1em 0 1em 0;
    border-bottom: solid 0.1px #d2d2d2;
    opacity: ${props => props.disabled ? 0.4 : 1};
`;


const FilesList = styled('ul')`
    list-style-type: none;
    margin: 0px 0 0 0;
    -webkit-margin-before: 0px;
    -webkit-margin-after: 0em;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    -webkit-padding-start: 0px;
`;

const Hovered = styled('div')`
    visibility:hidden;
`;
const Unhovered = styled('div')`
    visibility: visible;
`;

const FilesListItem = styled('li')`
    display: flex;
    direction: row;
    justify-content: space-between;
    padding: 0.5em 0.25em;
    &:hover {
        border-radius: 7px;
        border: solid 2px #e7e7e7;
    };
    &:hover ${Hovered} {
        visibility: visible;
    }
    &:hover ${Unhovered} {
        visibility: hidden;
    }

`;


const FilesListFile = styled('span')`
    display: flex;
    direction: row;
    justify-content: flex-start;
    padding: 0;
    margin: 0;
    &:hover ${Hovered} {
        visibility: visible;
    }

`;

const StyledInviteListItem = styled('li')`
    padding: 1em 0 1em 0;
    border-bottom: solid 0.1px #d2d2d2;
    cursor: pointer
`

interface InviteProps {
    children: React.ReactNode,
    msg: string
}
interface InviteComponentState {
    active: boolean
}

class InviteListItem extends React.Component<InviteProps, InviteComponentState>{
    constructor(props: InviteProps) {
        super(props)
        this.state = {
            active: false
        }
    }
    render() {
        const { children, msg } = this.props
        const { active } = this.state
        return (
            <StyledInviteListItem onClick={() => this.setState({ active: !active })}>
                {children}
                {active &&
                    <Text fontSize="0.9em" fontWeight="400" color="#4a4a4a">
                        {msg}
                    </Text>}
            </StyledInviteListItem>
        )
    }
}

export {
    StyledDashboardContainer as DashboardContainer,
    SidebarContainer, MainContentContainer,
    SidebarList as UL, SidedbarListItem as LI,
    UserList, UserListItem, FilesList, FilesListItem, FilesListFile, InviteListItem, Hovered, Unhovered
}