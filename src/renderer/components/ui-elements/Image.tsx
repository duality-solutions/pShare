import styled from "styled-components"

const AppLogo = styled('img')`
    src: ${(props: { src : string }) => props.src };
    width: ${(props: { width?: string, src?: string }) => props.width ? props.width : '100%'};
    height: ${(props: { height?: string, width?: string, src?: string }) => props.height ? props.height : '100px'};
    align-self: center;
`

export {
    AppLogo
}