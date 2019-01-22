import styled from "styled-components"

interface ImageProps {
    src? : string,
    width?: string,
    height?: string
}

const AppLogo = styled('img')<ImageProps>`
    src: ${props => props.src };
    width: ${props => props.width ? props.width : '100%'};
    height: ${props=> props.height ? props.height : '100px'};    
`

export {
    AppLogo
}