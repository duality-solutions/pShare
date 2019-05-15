import * as React from 'react';
import styled from 'styled-components';
import back_arrow_svg from '../../assets/svgs/back-nav-arrow.svg';
import { InboxIcon, OutboxIcon } from './Image';
import { Text } from './Text';
import { Divider } from './Divider';


interface ButtonProps {
  align?: string,
  primary?: boolean,
  theme?: { blue: string },
  direction?: string,
  width?: string,
  minHeight?: string,
  fontSize?: string,
  margin?: string,
  type?:string
}

interface ArrowButtonProps {
  label: string,
  onClick?: () => void,
  type?: string,
  disabled?: boolean,
  focus?: boolean
}

const StyledButton = styled('button') <ButtonProps>`
  align-self: ${(props) => props.align ? props.align : 'center'};
  justify-content: center;
  min-width: ${(props)=> props.width || '218px'};
  min-height: ${(props)=> props.minHeight || '2em'};
  font-size: ${(props)=> props.fontSize || '1em'};
  background: ${(props) => props.primary ? props.theme.blue : 'white'} ;
  border-radius: 3px;
  border: 1px solid ${(props) => props.primary ? '#0073e6' : '#d2d2d2'};
  color: ${props => props.primary ? 'white'  : props.theme.blue};
  margin: ${props=> props.margin || '0 0 0 0'};
  padding: 0.5em 1em;
  cursor: pointer;
`
const LightButton = styled('button')<ButtonProps>`
  align-self: ${(props) => props.align ? props.align : 'center'};
  justify-content: center;
  min-width:218px;
  min-height: 2em;
  font-size:1em ;
  background: white ;
  border-radius: 3px;
  border: 2px solid ${(props) => props.theme.blue};
  color: ${(props) => props.theme.blue};
  /* margin: 0.5em 1em; */
  margin: 0 0 0 0;
  padding: 0.5em 1em;
  cursor: pointer;
`

const StyledBackArrowButton = styled('div')`
  display: block;
  direction: column;
  width: 100px;
  cursor: pointer;
`


const BackArrowButton: React.FunctionComponent<{ onClick: () => void, marginTop?: string }> = ({ onClick, marginTop }) => (
  <StyledBackArrowButton onClick={() => onClick()}>
    <img src={back_arrow_svg} style={{ marginTop: marginTop || '175%'}} />
  </StyledBackArrowButton>
)


const ArrowButton:React.FunctionComponent<ArrowButtonProps> = ({ label, onClick, type, disabled, focus }) => (
  <StyledButton autoFocus={focus} onClick={onClick} primary direction="row-reverse" align="flex-end" type={type} disabled={disabled} >
      {label} <span style={{float:"right"}}>&#8594;</span>
  </StyledButton>
)

const StyledSharedButton = styled('div')<{ white?: boolean , margin?: string}>`
  width: 132px;
  height: 42px;
  display: flex;
  border-radius: 4px;
  background-color: ${props => props.white ? "white" : '#4f4f4f'};
  box-shadow: 0 0 14px 0 rgba(0, 0, 0, 0.1);
  margin: ${props => props.margin};
  cursor: pointer;
`;
const BackButton:React.FunctionComponent<{margin?: string, onClick?: ()=> void }> = ({ margin, onClick }) => (
  <img src={back_arrow_svg} onClick={onClick} style={{ 
      float: 'left', margin , position: 'fixed', cursor: 'pointer'
    }}/>)

const SharedButton:React.FunctionComponent<{ onClick: () => void, white?: boolean, margin?: string, }> = ({ onClick, white, margin }) => (
  <StyledSharedButton onClick={onClick} white={white} margin={margin || "0 8px 0 0"}>
    <InboxIcon white={!white} margin="8px 0 0 0" width="35px" height="25px"/> 
    <Divider margin="0 5px 0 0" height="42px" background={white? "#e9e9e9": "white"} opacity="0.1"/> 
    <Text fontWeight="bold" margin="12px 0 0 16px" fontSize="0.7em" color={white?  "#4a4a4a": "white"}>
        SHARED
    </Text>
  </StyledSharedButton>
)

const DownloadButton:React.FunctionComponent<{ onClick: () => void, white?: boolean,  margin?: string, }> = ({ onClick, white, margin }) => (
  <StyledSharedButton onClick={onClick} white={white} margin={margin || "0 8px 0 0"}>
    <OutboxIcon white={!white} margin="8px 0 0 0" width="35px" height="25px"/>
       <Divider margin="0 5px 0 0" background={white? "#e9e9e9": "white"} height="42px" width="0.5px" opacity="0.1" /> 
        <Text margin="12px 0 0 8px" fontSize="0.7em" color={white ? "#4a4a4a" : "white"} fontWeight="bold">
            DOWNLOADS
        </Text>
  </StyledSharedButton>
)
export default StyledButton

export { ArrowButton, BackArrowButton, LightButton, SharedButton, DownloadButton, BackButton };


