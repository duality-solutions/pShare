import * as React from 'react'
import Container from './ui-elements/Container';
import { H1, Text } from './ui-elements/Text';
import Button from "./ui-elements/Button"
import Box from "./ui-elements/Box"
import logo from "../assets/logowt.svg"
import { AppLogo } from './ui-elements/Image';
import Card from './ui-elements/Card';
import { CSSTransitionGroup } from 'react-transition-group'

export interface SyncAgreeStateProps {

}
export interface SyncAgreeDispatchProps {

  userAgreeSync: () => void

}
type SyncAgreeProps = SyncAgreeStateProps & SyncAgreeDispatchProps

export const SyncAgree: React.FunctionComponent<SyncAgreeProps> =
  ({ userAgreeSync }) =>
    <>
    <CSSTransitionGroup
      transitionName="fadeContainerIn"
      transitionAppear={true}
      transitionAppearTimeout={2000}
      transitionEnter={false}
      transitionLeave={false}>
    
      <Box width="100%" margin="2em 0 -1.5em 0" align="center">
        <AppLogo src={logo} width="100px" height="120px" />
      </Box>
      </CSSTransitionGroup>

      <CSSTransitionGroup
      transitionName="fadeContainerIn"
      transitionAppear={true}
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={true}
      transitionLeaveTimeout={500}>

      <H1 align="center" colored>Welcome</H1>
      <Container height="50vh">
      <Box direction="column" width="100%" align="center">
        <Box direction="column" width="50%" align="right" margin="0 auto 0 auto">
          <Card width="100%"> 
            <Text>
              Before we begin, we need to sync a whole bunch of data we'll 
              need to communicate with other pShare users.
            </Text>
            <Text>
              This sycning process can take a while.
            </Text>
            <Text>
              So, sit back, chill out, go get the kids from school; make a cuppa;
              go organise that drawer you've been meaning to. If you can,
              turn on the console and have a bash. 
            </Text>
            <Text>
              We'll see you soon...
            </Text>
          </Card>      
          <Button primary onClick={() => userAgreeSync()} direction="row-reverse" align="flex-end" >
          Proceed
          </Button>
        </Box>
      </Box>

      </Container>
      </CSSTransitionGroup>
    </>