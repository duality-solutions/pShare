import React from "react";
import { CSSTransitionGroup } from 'react-transition-group';
import logo from "../../assets/svgs/logo_without_text.svg";
import Box from "../ui-elements/Box";
import { ArrowButton } from "../ui-elements/Button";
import { Card } from "../ui-elements/Card";
import Container from "../ui-elements/Container";
import { AppLogo } from '../ui-elements/Image';
import Input from "../ui-elements/Input";
import { H1, Text } from "../ui-elements/Text";

export interface EnterUsernameStateProps {
    username: string | undefined
}
export interface EnterUsernameDispatchProps {
    enterUsername : () => void,
    handleUsername: (username: string) => void
}
type EnterUsernameProps = EnterUsernameDispatchProps & EnterUsernameStateProps


export const EnterUsername:React.FunctionComponent<EnterUsernameProps> = ({ enterUsername, username, handleUsername })=>
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
     <H1 align="center" colored fontWeight="600">Create Account</H1>
    <Container height="50vh" margin="10% 0 0 0">
    <Box direction="column" align="center" width="100%">
    <Box direction="column" width="700px" align="start" margin="0 auto 0 auto">
    <Card width="100%" align="center" minHeight="225px" padding="2em 12em 2em 8em">
        <Text fontSize="14px">Enter a user name</Text>
        <Input placeholder="User name" margin="1em 0 1em 0" padding="0 1em 0 1em" value={username} 
               onChange={(e) => {
                                    console.log(e.target.value)
                                    handleUsername(e.target.value)
                                }} />
    </Card>
    </Box>  
    <Box direction="column" width="700px" align="right" margin="0 auto 0 auto">
    <ArrowButton label="Continue" onClick={()=>{console.log('buttonclicked'); enterUsername()}}/>
    </Box>
    </Box>
    </Container>
    </CSSTransitionGroup>
    </> 