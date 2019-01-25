import styled from "styled-components";

interface InputProps {
    width?: string,
    height?: string,
    align?: string,
    padding?: string,
    margin?: string
}

const Input = styled('input')<InputProps>`
    width: ${props => props.width || '100%'};
    height: 5em;
    border: solid 1px #b9b9b9;
    border-radius: 4px;
    background-color: #fafafa;
    margin: ${props => props.margin || '0 0 0 0'} ;
    padding: ${props => props.padding || '0 0 0 0'};
    font-size: 0.8em;

`

export default Input

export { Input };

