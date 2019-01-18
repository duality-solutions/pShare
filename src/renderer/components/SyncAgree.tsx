import * as React from 'react'
import Container from './ui-elements/Container';
import { H1, Text } from './ui-elements/Text';
import Button from "./ui-elements/Button"
import Box from "./ui-elements/Box"
import logo from "../assets/logowt.svg"
import { AppLogo } from './ui-elements/Image';
import Card from './ui-elements/Card';

export interface SyncAgreeStateProps {

}
export interface SyncAgreeDispatchProps {

  userAgreeSync: () => void

}
type SyncAgreeProps = SyncAgreeStateProps & SyncAgreeDispatchProps

export const SyncAgree: React.FunctionComponent<SyncAgreeProps> =
  ({ userAgreeSync }) =>
    <>
      <Box width="100%" margin="2em 0 -1.5em 0" align="center">
        <AppLogo src={logo} width="100px" height="120px" />
      </Box>
      <H1 align="center" colored>Welcome</H1>
      <Container height="50vh">
      <Box direction="column" width="100%" align="center">
        <Box direction="column" width="50%" align="right" margin="0 auto 0 auto">
          <Card width="100%"> 
            <Text>
              Before you begin, we need to get a whole bunch of data that we'll 
              need to run and communicate with other blockchain nodes.
            </Text>
            <Text>
              This process can take a bit of time (like an hour or two). It will end, all things do.
            </Text>
            <Text>
              So, sit back, chill out, go get the kids from school; make a cuppa;
              go organise that drawer you've been meaning to. If you can,
              turn the console on and have a bash. 
            </Text>
            <Text>
              We'll see you soon......
            </Text>
          </Card>      
          {/* <Box width="100%" direction="row" > */}
          <Button primary onClick={() => userAgreeSync()} style={{margin:'0 0 0 0'}}>Agree to sync</Button>
        </Box>
      </Box>
      {/* </Box> */}
      </Container>
    </>