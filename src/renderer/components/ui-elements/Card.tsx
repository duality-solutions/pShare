import styled from 'styled-components';

const StyledCard = styled('div')`
    /* display: block; */
    /* direction: column; */
    min-width: 2em;
    width: ${(props: { width?: string }) => props.width ? props.width : '500px' };
    min-height: 2em;
    box-shadow:  1px 1px 1px 1px #F7F6F6;
    border: solid 2px #f7f6f6;
    padding: 1em;
    margin: 1em 0 ;
`

export default StyledCard

export { 
    StyledCard as Card 
}