import React from "react";
import Container from "./ui-elements/Container"
import Box from "./ui-elements/Box"
import { H1 } from "./ui-elements/Text"
import { AppLogo }from './ui-elements/Image';
import logo from "../assets/logowt.svg"

export const Main:React.FunctionComponent = ()=>
    <>
    <Box width="96%">
    <AppLogo src={logo} width="100px" height="120px" />
    </Box>
  <Container height="50vh">
    <Box direction="column" >
      <H1 align="center" colored>Sync is Complete</H1>
   </Box>
    </Container>
    </> 