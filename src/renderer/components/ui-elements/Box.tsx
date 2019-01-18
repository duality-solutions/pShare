import styled from "styled-components"

const StyledBox = styled('div')`
    text-align: ${(props: { align?: string }) => props.align || 'start'}; 
    width: ${(props: { width?:string }) => props.width ? props.width: '500px'};    
    margin: ${(props: { margin?: string, direction? : string, align?:string, width?:string, alignItems?:string })  => 
                props.margin ? props.margin : '0 0 0 0' };
    min-width: 500px;
    box-sizing: border-box;  
`

export default StyledBox

export {
    StyledBox as Box
}