import * as React from 'react';
import styled, { keyframes } from "styled-components";
import Container from './Container';
interface StyledPshareSpinnerProps {
    width?: number,
}

const StyledOverlay = styled('div')`
  position: fixed;
  z-index: 999;
  height: 100%;
  width: 100%;
  overflow: visible;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0,0,0,0.8);
`

const StyledPshareSpinner = styled('div')<StyledPshareSpinnerProps>`
    width: ${props => `${props.width}px` || '100px'};
    height: ${props => props.width ? `${props.width * (239/167)}px` : '100px' };
    margin: auto;
`;

const animationSpin = keyframes`
        from {
        transform: rotate(0deg);
        }

        to {
        transform: rotate(360deg);
        }
`

const StyledPshareSpinnerContainer = styled(StyledPshareSpinner)`
        animation-duration: 2s;
        animation-name: ${animationSpin};
        animation-delay: 0.5s;
        animation-timing-function: ease-in-out;
        transform-origin: 49.75% 40.25%;
        width: 100%;
        height: 100%;
        animation-iteration-count: infinite;
`;

const animationSlideIn = keyframes`
        from {
        transform: translateY(0) scaleY(1);
        visibility: visible;
        }

        50% {
        transform: translateY(-69px) scaleY(0.9);
        visibility: visible;
        }

        50.000001% {
        visibility: hidden;
        transform: translateY(-69px) scaleY(0.9);
        }

        to {
        transform: translateY(-69px) scaleY(0.9);
        visibility: hidden;
        }
`
const StyledPath1 = styled('path')`
    fill: ${props => props.theme.blue};
`
const StyledPath2 = styled('path')`
        animation-duration: 1.5s;
        animation-name: ${animationSlideIn};
        animation-fill-mode: forwards;
        animation-timing-function: ease-in-out;
        fill: ${props => props.theme.blue};
`

const StyledPolygon1 = styled('polygon')`
        fill: white;
`
const StyledPolygon2 = styled('polygon')`
        fill: black;
        opacity: 0.1;
`
const StyledPolygon3 = styled('polygon')`
        fill: black;
        opacity: 0.05;
`

const LoadingSpinner:React.FunctionComponent<{ active?: boolean }>= ({ active }) => 
    <> {active && 
    <StyledOverlay>
        <Container margin="25% 0 auto 0">
        <StyledPshareSpinner width={100}>
        <StyledPshareSpinnerContainer>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 167 239" preserveAspectRatio="xMidYMid meet">
        <StyledPath1  d="M 83,0 0,48 v 96 c 83,47 0,0 83,48 l 83,-48 V 48 Z M 123,119 83,142 43,119 V 73 L 83,50 123,73 Z"/>
        <StyledPolygon1 points="249,179 209,202 209,249 249,272 289,249 289,202 " transform="translate(-166,-129)" />
        <StyledPath2  d="M 0,238 43,213 V 167 L 0,143 Z" />
        <StyledPolygon2 points="250,226 333,177 333,274 250,322 " transform="translate(-166,-129)"/>
        <StyledPolygon3 points="250,129 333,177 250,226 166,177 " transform="translate(-166,-129)"/>
        </svg>
        </StyledPshareSpinnerContainer>
        </StyledPshareSpinner>
        </Container>
    </StyledOverlay>} 
    </>

export default LoadingSpinner
