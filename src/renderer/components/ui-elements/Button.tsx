
import styled from 'styled-components'

interface ButtonProps {
  align?: string, 
  primary?: boolean, 
  theme?: { blue: string }, 
  direction?: string 
}

 const StyledButton = styled('button')<ButtonProps>`
  align-self: ${(props) => props.align ? props.align : 'center'};
  justify-content: center;
  min-width:218px;
  min-height: 2em;
  font-size:1em ;
  background: ${(props) => props.primary ? props.theme.blue : 'palevioletred'} ;
  border-radius: 3px;
  border: 2px solid ${(props) => props.primary ? '#0073e6' : 'palevioletred'};
  color: white;
  /* margin: 0.5em 1em; */
  margin: 0 0 0 0;
  padding: 0.5em 1em;
  cursor: pointer;
`

export default StyledButton
