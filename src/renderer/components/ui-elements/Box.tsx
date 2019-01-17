import styled from "styled-components"

const StyledBox = styled('div')`
    display: flex;
    flex-direction: ${(props: { direction?: string, align?:string, width?:string }) => props.direction ? props.direction : 'row'};
    align-self: ${(props: { direction?: string, align?:string, width?:string }) => props.align ? props.align : 'center'};
    width: ${(props: { direction?: string, align?:string, width?:string }) => props.width ? props.width: '500px'};
    padding: 1em;
    margin: 1em ;

`

export default StyledBox

export {
    StyledBox as Box
}