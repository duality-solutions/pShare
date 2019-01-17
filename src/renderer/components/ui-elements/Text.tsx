import styled from "styled-components";

const StyledHeader = styled('h1')`
    text-align: ${(props: { align?: string }) => props.align || 'start'};
    margin: 0 0 0 0;
    font-weight: lighter;
    color: ${(props: { align?:string, colored?: boolean, theme: { blue: string } }) => props.colored ? props.theme.blue : 'black' };
`

const StyledText = styled('p')`
    text-align: ${(props: { align?: string }) => props.align || 'start'};
    margin: 0 0 1em 0;
    line-height: 1.2em;
`

export default StyledText 

export { 
    StyledHeader as H1,
    StyledText as Text
}