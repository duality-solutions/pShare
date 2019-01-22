import * as React from 'react'
import styled from 'styled-components'
import { H1, Text } from './Text'
// import Box from "./Box"
interface ProgressBarProps {
    status: string,
    level: number
}

const StyledProgress = styled.div`
  display: flex;
  flex-direction:column;
  align-items: center;
  background: #2e77d0;
  box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.05);
    border: solid 2px #f7f6f6;
    border-radius: 6px;
  min-height: 10em;
  max-width: 750px;
  width:100%;
  height: 200px;
  padding: 0.25em 1em;
  margin: auto;
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
const StyledBarProgress = styled('span')<{level:number}>`
    background: white;
    border: 0px solid white;
    border-radius: 8px;
    overflow: hidden;
    width: ${props => `${props.level}%`};
`

const ProgressBar:React.FunctionComponent<ProgressBarProps> = ({ status , level }) =>
    <StyledProgress>
        <H1 align="center" color="white" margin="0.5em 0 0.4em 0">
            {level}%
        </H1>
        <Text align="center" color="white" margin="0.2em 0 1.2em 0">
            {status}
        </Text>
        <StyledBarContainer >
            <StyledBarProgress level={level}/>
        </StyledBarContainer>
    </StyledProgress>

export default ProgressBar

