import styled from 'styled-components';

const Container = styled('div')`    
    height: ${(props: { height? : string }) => props.height ? props.height :'90vh'};    
    margin-top: 5%;
`

export default Container