import React from "react";
import Container from "./ui-elements/Container"
import Box from "./ui-elements/Box"
import { H2 } from "./ui-elements/Text"

export const Main:React.FunctionComponent = ()=>
    <>
    <Container>
    <Box direction="column" >
      <H2 align="center" colored>Sync is Complete</H2>
   </Box>
    </Container>
    </>