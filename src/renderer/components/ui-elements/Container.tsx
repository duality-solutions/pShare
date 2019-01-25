import styled from 'styled-components';

interface ContainerProps {
    height? : string,
    margin? : string,
}

const Container = styled('div')<ContainerProps>`    
    height: ${props => props.height ? props.height :'90vh'};    
    margin: ${props => props.margin || '5% 0 0 0'};
`

export default Container