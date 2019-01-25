import React from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../assets/svgs/logo_with_text.svg";
import addIcon from "../assets/svgs/p-share-add.svg";
import Box from "./ui-elements/Box";
import { SCard } from "./ui-elements/Card";
import Container from "./ui-elements/Container";
import { AppLogo } from './ui-elements/Image';
import { H1, Text } from "./ui-elements/Text";

export interface CreateAccountStateProps {

}
export interface CreateAccountDispatchProps {
    createAccount : () => void 
}
type CreateAccountProps = CreateAccountDispatchProps & CreateAccountStateProps

export const CreateAccount:React.FunctionComponent<CreateAccountProps> = 
    ({ createAccount}) =>
    <>
    <Box width="100%" margin="4em 0 8em 0" align="center" >
        <AppLogo src={logo} width="180px" height="150" />
    </Box>

    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={false}>

    <Container height="50vh">
    <Box direction="column" align="center" width="100%">
    <Box display="flex" direction="row" align="center" width="100%">
        <SCard onClick={()=> createAccount()}>
            <img src={addIcon} height="80px" width="80px"/>
            <H1 align="center" color="white">Create Account</H1>
            <Text color="white">Create a brand new account</Text>
        </SCard>
        {/* <SCard onClick={()=> createAccount()}>
            <img src={addIcon} height="80px" width="80px"/>
            <H1 align="center" color="white">Restore Account</H1>
            <Text color="white">Create a brand new account</Text>
        </SCard> */}
    </Box>
    </Box>
    </Container>


    </CSSTransitionGroup>
    </> 