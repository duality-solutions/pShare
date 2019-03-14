import styled from 'styled-components'

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

const MainContentContainer = styled('div')`
    display: flex;
    height:100%;
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


const SidedbarListItem = styled('li')<{disabled?: boolean, dark?:boolean}>`
    display: flex;
    flex-direction: column;
    justify-content:center;
    cursor: ${props => props.disabled ? 'default' : 'pointer'};
    height: 64px;
    max-height: 64px;
    border-bottom: solid 0.1px #d2d2d2;
    opacity: ${props => props.disabled ? 0.4 : 1};
    background: ${props=> props.dark ? '#4f4f4f' : ''};
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

const UserListItem = styled('li')<{disabled?: boolean}>`
    display: flex;
    direction: row;
    justify-content: space-between;
    padding: 1em 0 1em 0;
    border-bottom: solid 0.1px #d2d2d2;
    opacity: ${props => props.disabled ? 0.4 : 1};
    `;

export {
    StyledDashboardContainer as DashboardContainer,
    SidebarContainer, MainContentContainer,
    SidebarList as UL, SidedbarListItem as LI,
    UserList, UserListItem,
}