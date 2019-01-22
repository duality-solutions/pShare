import React from "react";
import Box from "./ui-elements/Box";
import { Text, H1 } from "./ui-elements/Text";
import { AppLogo }from './ui-elements/Image';
import logo from "../assets/svgs/logowt.svg";
import addIcon from "../assets/svgs/p-share-add.svg"
import { CSSTransitionGroup } from 'react-transition-group';
import Container from "./ui-elements/Container";
import { SCard } from "./ui-elements/Card";


export const CreateAccount:React.FunctionComponent = ()=>
    <>
    <Box width="100%" margin="2em 0 -1.5em 0" align="center">
        <AppLogo src={logo} width="100px" height="120px" />
    </Box>

    <CSSTransitionGroup
      transitionName="example"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={false}>

    <Container height="50vh">
    <Box direction="column" align="center" width="100%">
    <Box direction="row" align="center" width="100%">
        <SCard>
            <img src={addIcon} height="80px" width="80px"/>
            <H1 align="center" color="white">Create Account</H1>
            <Text color="white">Create a brand new account</Text>
        </SCard>
    </Box>
    </Box>
    </Container>


    </CSSTransitionGroup>
    </> 