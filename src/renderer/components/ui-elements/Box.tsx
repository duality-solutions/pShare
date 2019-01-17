import styled from "styled-components"

const StyledBox = styled('div')`
    display: flex;
    flex-direction: ${(props: { direction?: string, align?:string, width?:string }) => props.direction ? props.direction : 'row'};
    align-self: ${(props: { direction?: string, align?:string, width?:string }) => props.align ? props.align : 'center'};
    width: ${(props: { direction?: string, align?:string, width?:string }) => props.width ? props.width: '500px'};
    justify-content: center;
    align-items: ${(props: {direction? : string, align?:string, width?:string, alignItems?:string}) => 
                    props.alignItems ? props.alignItems : "center"};
    margin: ${(props: { margin?: string, direction? : string, align?:string, width?:string, alignItems?:string })  => 
                props.margin ? props.margin : '0 0 0 0' };
    /* padding: 1em;
    margin: 1em ; */

`

export default StyledBox

export {
    StyledBox as Box
}