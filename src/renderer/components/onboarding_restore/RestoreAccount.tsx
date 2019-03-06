import React from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../../assets/svgs/logo_without_text.svg";
import passphrase from "../../assets/svgs/passphrase-32-white.svg";
import passphrasesecurefile from "../../assets/svgs/secure-file-32-white.svg";
import Box from "../ui-elements/Box";
import { SCard } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
import { H1, Text } from "../ui-elements/Text";

export interface RestoreAccountStateProps {

}
export interface RestoreAccountDispatchProps {
    restoreAccount : () => void 
}
type RestoreAccountProps = RestoreAccountDispatchProps & RestoreAccountStateProps

export const RestoreAccount:React.FunctionComponent<RestoreAccountProps> = 
    ({ restoreAccount }) =>
    <>
    <Box width="100%" margin="2em 0 -1.5em 0" align="center" >
        <AppLogo src={logo} width="100px" height="120px" />
    </Box>
    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={false}>
      <H1 align="center" colored fontWeight="600">Restore Account</H1>
    <Container height="50vh" padding="4em 0 0 0">
    <Box direction="column" align="center" width="100%">
    <Box display="flex" direction="row" align="center" width="100%">
        <SCard onClick={()=> restoreAccount()} padding="2em 1em 0em 1em" height="140px" width="220px">
            <img src={passphrase} height="60px" width="60px" style={{margin:'0 0 1em 0'}}/>
            <Text align="center" color="white" fontSize="1em" fontWeight="bold">Restore using passphrase</Text>
        </SCard>
        <SCard onClick={()=> restoreAccount()} padding="2em 1em 0em 1em" height="140px" width="220px">
            <img src={passphrasesecurefile} height="60px" width="60px" style={{margin:' 0 0 1em 0'}} />
            <Text align="center" color="white" fontSize="1em" fontWeight="bold" >Restore using secure file</Text>
        </SCard>
    </Box>
    </Box>
    </Container>
    </CSSTransitionGroup>
    </> 
