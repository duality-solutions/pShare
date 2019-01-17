import * as React from 'react'
import Container from './ui-elements/Container';
import { H2, Text } from './ui-elements/Text';
import Button from "./ui-elements/Button"
import { Card } from './ui-elements/Card';
import Box from "./ui-elements/Box"

export interface SyncAgreeStateProps {

}
export interface SyncAgreeDispatchProps {

  userAgreeSync: () => void

}
type SyncAgreeProps = SyncAgreeStateProps & SyncAgreeDispatchProps

export const SyncAgree: React.FunctionComponent<SyncAgreeProps> =
  ({ userAgreeSync }) =>
    <>
      <Container>
      <Box direction="column" width="600px">
      <H2 align="center" colored>Welcome</H2>
        <Card width="550px">
        <Text>
        Before you begin, we need to get a whole bunch of data that we'll 
        need to run and communicate with other blockchain nodes. This process
        can take a bit of time (like an hour or two). It will end, all things do.
        So, sit back, chill out, go get the kids from school; make a cuppa;
        go organise that drawer you've been meaning to. If you can,
        turn the console on and have a bash. 
        </Text>
        <Text>
        We'll see you soon......
        </Text>
        </Card>
        <Button primary align="flex-end" onClick={() => userAgreeSync()}>Agree to sync</Button>
        </Box>
      </Container>
    </>