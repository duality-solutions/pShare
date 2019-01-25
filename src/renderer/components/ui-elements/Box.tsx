import styled from "styled-components"

interface BoxProps {
    align? : string,
    margin? : string,
    width? : string,
    direction?: string,
    display?: string,
}

const StyledBox = styled('div')<BoxProps>`
    display: ${props => props.display || 'block'};
    justify-content:center;
    text-align: ${props => props.align || 'start'}; 
    width: ${props => props.width ? props.width: '500px'};    
    margin: ${props  =>  props.margin ? props.margin : '0 0 0 0' };
    box-sizing: border-box;  
`

export default StyledBox

export {
    StyledBox as Box
}

