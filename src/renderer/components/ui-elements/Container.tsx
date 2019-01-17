import styled from 'styled-components';

const Container = styled('div')`
    display: flex;
    height: ${(props: { height? : string }) => props.height ? props.height :'90vh'};
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export default Container