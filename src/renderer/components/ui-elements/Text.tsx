import styled from "styled-components";

const StyledHeader = styled('h1')`
    text-align: ${(props: { align?: string }) => props.align || 'start'};
    letter-spacing: 0.03em;
    margin: ${(props: {align?:string, margin? : string }) => props.margin ? props.margin  : "0 0 0 0"};
    font-weight: bold;
    color: ${(props: { align?:string, margin?:string, color?:string, colored?: boolean, theme: { blue: string } }) => {
                    if(props.colored) return props.theme.blue;
                    else if (props.color) return props.color
                    else return 'black'
            }};
    min-width: 500px;
`

const StyledText = styled('p')`
    text-align: ${(props: { align?: string }) => props.align || 'start'};
    margin: ${(props: {align?:string, margin? : string }) => props.margin ? props.margin  : "1em 0 0 0"};    
    line-height: 1.4em;
    color: ${(props: { align?:string, margin?:string,color?:string, colored?: boolean, theme: { blue: string } }) => {
                    if(props.colored) return props.theme.blue;
                    else if (props.color) return props.color
                    else return 'black'
        }};
`

export default StyledText 

export { 
    StyledHeader as H1,
    StyledText as Text
}