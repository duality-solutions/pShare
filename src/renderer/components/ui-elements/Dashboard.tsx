import styled from 'styled-components'

const StyledDashboardContainer = styled('div')`
    height: 100vh;
    width: 100vw;
    display: flex;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
`;

const SidebarContainer = styled('div')`
    display: flex;
    height:100%;
    width: 80px;
    direction: column;
    min-width: 80px;
    background: #fafafa;
    border-right: solid 0.1px #D3D3D3;
`;

const MainContentContainer = styled('div')`
    display: flex;
    height:100%;
    width: 100%;
    direction: column;
    background: white;
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


const SidedbarListItem = styled('li')`
    padding: 0.5em 0.5em;
    cursor: pointer;
    border-bottom: solid 0.1px #D3D3D3;
`;

export {
    StyledDashboardContainer as DashboardContainer,
    SidebarContainer, MainContentContainer,
    SidebarList as UL, SidedbarListItem as LI
}