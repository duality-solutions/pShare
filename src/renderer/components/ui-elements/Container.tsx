import styled from 'styled-components';

interface ContainerProps {
    height? : string,
}

const Container = styled('div')<ContainerProps>`    
    height: ${props => props.height ? props.height :'90vh'};    
    margin-top: 5%;
`

export default Container