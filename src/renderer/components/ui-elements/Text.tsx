import styled from "styled-components";

interface H1Props {
    align? : string,
    margin? : string,
    color? : string,
    colored? : boolean,
    theme?: { blue: string }
}

interface ParaProps {
    align?: string,
    margin? : string
    color? : string,
    colored? : boolean,
    theme?: { blue: string }
}

const StyledHeader = styled('h1')<H1Props>`
    text-align: ${props => props.align || 'start'};
    letter-spacing: 0.03em;
    margin: ${props => props.margin || "0 0 0 0"};
    font-weight: bold;
    color: ${ props => {
                    if(props.colored) return props.theme.blue;
                    else if (props.color) return props.color
                    else return 'black'
            }};
    min-width: 500px;
`

const StyledText = styled('p')<ParaProps>`
    text-align: ${ props=> props.align || 'start'};
    margin: ${ props => props.margin ? props.margin  : "1em 0 0 0"};    
    line-height: 1.4em;
    color: ${ props => {
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