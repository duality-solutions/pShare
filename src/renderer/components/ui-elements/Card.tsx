import styled from 'styled-components';

const StyledCard = styled('div')`
    min-width: 2em;
    width: ${(props: { width?: string }) => props.width ? props.width : '500px' };
    min-height: 2em;
    box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.05);
    border: solid 1px #f1f1f1;
    border-radius: 4px;
    background-color: #ffffff;
    padding: 2em 4em;
    margin: 1em 0 ;
    box-sizing: border-box;
`

export default StyledCard

export { 
    StyledCard as Card 
}






