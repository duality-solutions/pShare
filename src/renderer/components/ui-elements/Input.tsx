import styled from "styled-components";

interface InputProps {
    width?: string,
    height?: string,
    align?: string,
    padding?: string,
    margin?: string,
    fontSize? : string,
}

const Input = styled('input')<InputProps>`
    display: inline-block;
    width: ${props => props.width || '100%'};
    text-align: ${props=> props.align || 'start'};
    font-size:${props=> props.fontSize || 'normal'} ;
    height: 50px;
    border: solid 1px #b9b9b9;
    border-radius: 4px;
    background-color: #fafafa;
    margin: ${props => props.margin || '0 0 0 0'} ;
    padding: ${props => props.padding || '0 0 0 0'};

`

export default Input

export { Input };

