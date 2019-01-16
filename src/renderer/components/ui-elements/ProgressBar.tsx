import * as React from 'react'
import styled from 'styled-components'

interface ProgressBarProps {
    status: string,
    level: string
}

const StyledProgress = styled.div`
  display: flex;
  flex-direction:column;
  align-items: center;
  /* justify-content: space-around; */
  background: #2e77d0;
  border-radius: 3px;
  border: 2px solid #2e77d0;
  min-height: 10em;
  max-width: 750px;
  height: 200px;
  margin: 40vh 15em;
  padding: 0.25em 1em;
`
const StyledHeader = styled('h1')`
    text-align: ${(props: { align?: string }) => props.align || 'start'};
    color: white;
    margin: .5em 0 0.5em 0;
`

const StyledText = styled('p')`
    text-align: ${(props: { align?: string }) => props.align || 'start'};
    color: white;
    margin: 0 0 1em 0;
    /* -webkit-margin: 0 0 0.5em 0 ; */
    line-height: 1.2em;
`

const StyledBarContainer = styled('div')`
    display: flex;
    border: 0px solid #01407f;
    border-radius: 12px;
    background: #01407f;
    opacity: 0.8;
    height:8px;
    margin: 1.2em 0 0 0; 
    width: 66%;

`
const StyledBarProgress = styled('span')`
    background: white;
    border: 0px solid white;
    border-radius: 8px;
    overflow: hidden;
    width: ${(props: { level: string }) => props.level };
`

const ProgressBar:React.FunctionComponent<ProgressBarProps> = ({ status , level }) =>
    <StyledProgress>
        <StyledHeader align ="center">
            {level}
        </StyledHeader>
        <StyledText align="center">
            {status}
        </StyledText>
        <StyledBarContainer >
            <StyledBarProgress level={level}/>
        </StyledBarContainer>
    </StyledProgress>

export default ProgressBar

