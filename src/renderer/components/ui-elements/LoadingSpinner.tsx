import * as React from 'react';
import styled from "styled-components";
import PshareSpinner from "../../assets/svgs/p-share-spinner.svg";

interface StyledPshareSpinnerProps {
    width?: number,
}

const StyledPshareSpinner = styled('div')<StyledPshareSpinnerProps>`
    width: ${props => `${props.width}px` || '100px'};
    height: ${props => props.width ? `${props.width * (239/167)}px` : '100px' };
`;

const StyledPshareSpinnerContainer = styled('div')`
        animation-duration: 1.5s;
        animation-name: slidein;
        animation-fill-mode: forwards;
        animation-timing-function: ease-in-out;
`;

const LoadingSpinner:React.FunctionComponent<{ active?: boolean }>= ({ active }) => 
    <>
        <StyledPshareSpinner width={200}>
        <img src={PshareSpinner} />
        </StyledPshareSpinner>
    </>

export default LoadingSpinner

// --p-share-spinner-width: 200px;
// --p-share-spinner-color: #2e77d0;
// --p-share-spinner-middle-color: white;


// const StyledLoadingSpinner = styled.div`
//  position: fixed; /* Sit on top of the page content */
//   display: none; /* Hidden by default */
//   width: 100vw; /* Full width (cover the whole page) */
//   height: 100vh; /* Full height (cover the whole page) */
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0,0,0,0.5); /* Black background with opacity */
//   z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
//   cursor: pointer; /* Add a pointer on hover */
// `
