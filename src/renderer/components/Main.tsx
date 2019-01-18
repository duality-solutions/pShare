import React from "react";
import Box from "./ui-elements/Box"
import { H1 } from "./ui-elements/Text"
import { AppLogo }from './ui-elements/Image';
import logo from "../assets/logowt.svg"

export const Main:React.FunctionComponent = ()=>
    <>
    <Box width="100%" margin="2em 0 -1.5em 0" align="center">
        <AppLogo src={logo} width="100px" height="120px" />
    </Box>
    <H1 align="center" colored>Sync is Complete</H1>
    </> 