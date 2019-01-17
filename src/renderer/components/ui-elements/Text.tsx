import styled from "styled-components";

const StyledHeader = styled('h1')`
    text-align: ${(props: { align?: string }) => props.align || 'start'};
    margin: .5em 0 0.5em 0;
    font-weight: lighter;
`

const StyledText = styled('p')`
    text-align: ${(props: { align?: string }) => props.align || 'start'};
    margin: 0 0 1em 0;
    /* -webkit-margin: 0 0 0.5em 0 ; */
    line-height: 1.2em;
`

export default StyledText 

export { 
    StyledHeader as H2,
    StyledText as Text
}